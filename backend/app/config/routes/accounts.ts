import { AccountsController } from '@/app/controllers/Accounts.controller'
import { Configuration } from '@/config'
import { Router } from 'express'

export const createAccountsRouter = (): Router => {
  const router = Router()
  const accountsController = new AccountsController()

  router.post('/login', accountsController.login)
  router.get('/current_user', accountsController.getCurrentUser)

  if (!Configuration.IS_PRODUCTION) {
    /*
        Esta ruta solo debe estar disponible en entornos de desarrollo.
        En producción, el registro de usuarios debe ser manejado por un administrador.
    */
    router.post('/register', accountsController.register)
  }

  return router
}
