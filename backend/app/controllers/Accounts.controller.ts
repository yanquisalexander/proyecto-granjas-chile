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
      const { webpanel } = req.query
      const user = await User.findByEmail(email)

      if (user && (await Authenticator.comparePassword(password, user.password))) {
        const expiresIn = Date.now() + 1000 * 60 * 60
        const token = jwt.sign({ user_id: user.id }, Configuration.JWT_SECRET, {
          expiresIn
        })

        if (webpanel) {
          const userRoles = await user.getRoles()
          const hasNecessaryRoles = userRoles.some(role => role.name === Roles.ADMIN || role.name === Roles.SUPER_ADMIN)
          if (hasNecessaryRoles) {
            res.json({
              access_token: token,
              token_type: 'Bearer',
              expires_in: expiresIn,
              scope: 'read write'
            })
            return
          } else {
            res.status(401).json({
              message: "Your account doesn't have the necessary permissions to access the webpanel."
            })
            return
          }
        }

        res.json({
          access_token: token,
          token_type: 'Bearer',
          expires_in: expiresIn,
          scope: 'read write'
        })
      } else if (user) {
        res.status(401).json({
          message: "The password that you've entered is incorrect."
        })
      } else {
        res.status(401).json({
          message: "The email that you've entered doesn't match any account."
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async getCurrentUser (req: Request, res: Response): Promise<void> {
    // @ts-expect-error Property 'user' does not exist on type 'Request'
    const user = await User.find((req.user.id))

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
