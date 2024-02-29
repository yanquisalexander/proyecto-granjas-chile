import { Request, Response, NextFunction } from 'express'
import User, { UserFilter } from '../models/User.model'
import { UserValidationError } from '@/lib/Error'

export class UsersController {
  async getUsers (req: Request, res: Response, next: NextFunction): Promise<void> {
    // [GET] /users?filters[username]=here_is_a_username&filters[email]=here_is_an_email
    const filters = req.query.filters as UserFilter
    if (filters) {
      const users = await User.search(filters)
      res.json(users)
    } else {
      const users = await User.getAll()
      res.json(users)
    }
  }

  async createUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    // [POST] /users
    const { username, email, password } = req.body
    const id = crypto.randomUUID()
    const user = new User({ id, username, email, password })
    try {
      await user.create()
      res.json(user)
    } catch (error) {
      if (error instanceof UserValidationError) {
        res.status(400).json({
          message: error.message,
          error_type: error.name
        })
      }
    }
  }
}
