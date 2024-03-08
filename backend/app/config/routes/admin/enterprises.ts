import { AdminEnterprisesController } from '@/app/controllers/admin/Enterprises.controller'
import { Roles } from '@/app/models/Role.model'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createAdminEnterprisesRouter = (): Router => {
  const router = Router()
  const adminEnterprisesController = new AdminEnterprisesController()

  router.get('/my-enterprise', Authenticator.requiredRoleMiddleware([Roles.ADMIN]), adminEnterprisesController.getMyEnterprise)
  router.get('/', adminEnterprisesController.getEnterprises)
  router.post('/', Authenticator.requiredRoleMiddleware([Roles.SUPER_ADMIN]), adminEnterprisesController.createEnterprise)
  router.delete('/:id', Authenticator.requiredRoleMiddleware([Roles.SUPER_ADMIN]), adminEnterprisesController.deleteEnterprise)
  router.put('/:id', Authenticator.hasSomeRolesMiddleware([Roles.SUPER_ADMIN, Roles.ADMIN]), adminEnterprisesController.updateEnterprise)
  router.get('/:id', adminEnterprisesController.getEnterprise)
  return router
}
