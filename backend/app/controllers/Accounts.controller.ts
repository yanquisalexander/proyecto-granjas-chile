import { Request, Response } from 'express';
import { Authenticator } from '@/lib/Authenticator';
import User from '@/app/models/User.model';
import { UserValidationError } from '@/lib/Error';
import { Roles } from '../models/Role.model';

const generateTokenResponse = (token: string) => ({
  access_token: token,
  token_type: 'Bearer',
  expires_in: 3600, // 1 hora en segundos
  scope: 'read write'
});

export class AccountsController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      const user = await User.findByEmail(email.toLowerCase());
      
      if (user && (await Authenticator.comparePassword(password, user.password))) {
        const token = Authenticator.jwtSign(user.id);
        res.json(generateTokenResponse(token));
      } else if (user) {
        res.status(401).json({
          message: "The password that you've entered is incorrect."
        });
      } else {
        res.status(401).json({
          message: "The email that you've entered doesn't match any account."
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      const user = await User.findByEmail(email.toLowerCase());
      
      if (user && (await Authenticator.comparePassword(password, user.password))) {
        const userRoles = await user.getRoles();
        const hasNecessaryRoles = userRoles.some(role => role.name === Roles.ADMIN || role.name === Roles.SUPER_ADMIN);
        
        if (hasNecessaryRoles) {
          const token = Authenticator.jwtSign(user.id);
          res.json(generateTokenResponse(token));
        } else {
          res.status(401).json({
            message: "Your account doesn't have the necessary permissions to access the admin panel."
          });
        }
      } else if (user) {
        res.status(401).json({
          message: "The password that you've entered is incorrect."
        });
      } else {
        res.status(401).json({
          message: "The email that you've entered doesn't match any account."
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const user = await User.find((req.user.id));

    if (!user) {
      res.status(401).json({ message: 'The user that you are trying to access does not exist or has been deleted.' });
      return;
    }

    const userAuthenticator = new Authenticator(user);
    const currentUser = await userAuthenticator.currentUser();
    res.json(currentUser);
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { password, password_confirmation } = req.body;
      if (password !== password_confirmation) {
        res.status(400).json({ message: 'Password confirmation does not match' });
        return;
      }
      const user = new User(req.body);
      user.id = User.generateId();
      user.password = await Authenticator.hashPassword(user.password);
      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error);
      if (error instanceof UserValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}
