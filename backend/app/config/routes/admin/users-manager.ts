import { AdminUsersController } from "@/app/controllers/admin/Users.controller"
import { Roles } from '@/app/models/Role.model'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createAdminUsersManagerRouter = (): Router => {
    const router = Router()
    const adminUsersController = new AdminUsersController()

    // GET /admin/users (All users of the system)
    router.get('/', Authenticator.requiredRoleMiddleware([Roles.SUPER_ADMIN]), adminUsersController.getUsers)


    return router
}
