import { Request, Response } from 'express'
import { Authenticator } from '@/lib/Authenticator'
import jwt from 'jsonwebtoken'
import { Configuration } from '@/config'
import User from '@/app/models/User.model'
import { UserValidationError } from '@/lib/Error'
import { Roles } from '../models/Role.model'

export class AccountsController {
  async login (req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const user = await User.findByEmail(email)
      if (user && (await Authenticator.comparePassword(password, user.password))) {
        const token = jwt.sign({ user_id: user.id }, Configuration.JWT_SECRET, {
          expiresIn: '1h'
        })

        res.json({ token })
      } else {
        res.status(401).json({ message: 'Invalid credentials' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async getCurrentUser (req: Request, res: Response): Promise<void> {
    // @ts-expect-error Property 'user' does not exist on type 'Request'
    const user = await User.find((req.user.id))
    await user?.addRole(Roles.SUPER_ADMIN)

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const userAuthenticator = new Authenticator(user)
    const currentUser = await userAuthenticator.currentUser()
    res.json(currentUser)
  }

  async register (req: Request, res: Response): Promise<void> {
    try {
      const { password, password_confirmation } = req.body
      if (password !== password_confirmation) {
        res.status(400).json({ message: 'Password confirmation does not match' })
        return
      }
      const user = new User(req.body)
      user.id = User.generateId()
      user.password = await Authenticator.hashPassword(user.password)
      await user.save()
      res.json(user)
    } catch (error) {
      console.error(error)
      if (error instanceof UserValidationError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
