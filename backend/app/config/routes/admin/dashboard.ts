import { AdminDashboardController } from '@/app/controllers/admin/Dashboard.controller'
import { Roles } from '@/app/models/Role.model'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createAdminDashboardRouter = (): Router => {
  const router = Router()
  const adminDashboardController = new AdminDashboardController()

  router.get('/problems', Authenticator.hasSomeRolesMiddleware([Roles.SUPER_ADMIN, Roles.ADMIN]), adminDashboardController.getProblems)
  return router
}
