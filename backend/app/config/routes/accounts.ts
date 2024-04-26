import { AccountsController } from '@/app/controllers/Accounts.controller'
import { Configuration } from '@/config'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createAccountsRouter = (): Router => {
  const router = Router()
  const accountsController = new AccountsController()

  router.post('/login', accountsController.login)
  router.post('/admin-login', accountsController.adminLogin)
  router.get('/current_user', Authenticator.middleware, accountsController.getCurrentUser)
  // TODO: Esta ruta debe anular el token de acceso del usuario actual.
  router.post('/logout', (req, res) => res.send('Logout'))
  if (!Configuration.IS_PRODUCTION) {
    /*
        Esta ruta solo debe estar disponible en entornos de desarrollo.
        En producción, el registro de usuarios debe ser manejado por un administrador.
    */
    router.post('/register', accountsController.register)
  }

  return router
}
