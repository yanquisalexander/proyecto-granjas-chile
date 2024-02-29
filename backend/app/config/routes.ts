import { Router } from 'express'

/*
    This is the main router file. It will be used to define all core routes for the application.

    Plugins and other routers should use getWebServerInstance().addRoute() method to add
    custom routes to the application.

*/

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' })
})

export default router
