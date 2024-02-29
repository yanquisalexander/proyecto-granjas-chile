import { Router } from 'express'
import { createUsersRouter } from './routes/users'
import { createEnterprisesRouter } from './routes/enterprises'

/*
    This is the main router file. It will be used to define all core routes for the application.

    Plugins and other routers should use getWebServerInstance().addRoute() method to add
    custom routes to the application.

*/

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' })
})

router.use('/users', createUsersRouter())

router.use('/enterprise', createEnterprisesRouter())

export default router
