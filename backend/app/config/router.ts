import { Router } from 'express'
import { createUsersRouter } from './routes/users'
import { createAdminEnterprisesRouter } from './routes/admin/enterprises'
import { Authenticator } from '@/lib/Authenticator'
import { createAccountsRouter } from './routes/accounts'
import { createFormsRouter } from './routes/forms'
import { createAdminDashboardRouter } from "./routes/admin/dashboard"
import { createAdminFormsRouter } from "./routes/admin/forms"

/*
    This is the main router file. It will be used to define all core routes for the application.

    Plugins and other routers should use getWebServerInstance().addRoute() method to add
    custom routes to the application.

*/

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' })
})

router.use('/users', Authenticator.middleware, createUsersRouter())

router.use('/accounts', createAccountsRouter())

router.use('/admin/enterprises', Authenticator.middleware, createAdminEnterprisesRouter())
router.use('/admin/users', Authenticator.middleware, createUsersRouter())
router.use('/admin/dashboard', Authenticator.middleware, createAdminDashboardRouter())
router.use('/admin/forms', Authenticator.middleware, createAdminFormsRouter())
router.use('/forms', createFormsRouter())

export default router
