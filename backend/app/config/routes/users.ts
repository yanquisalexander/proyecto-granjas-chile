import { UsersController } from '@/app/controllers/Users.controller'
import { Router } from 'express'

export const createUsersRouter = (): Router => {
  const router = Router()

  const usersController = new UsersController()

  router.get('/', usersController.getUsers)
  router.post('/', usersController.createUser)

  return router
}
