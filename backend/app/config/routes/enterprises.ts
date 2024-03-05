import { EnterprisesController } from '@/app/controllers/Enterprises.controller'
import { Roles } from '@/app/models/Role.model'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createEnterprisesRouter = (): Router => {
  const router = Router()
  const enterprisesController = new EnterprisesController()

  router.get('/', enterprisesController.getEnterprises)
  router.post('/', Authenticator.requiredRoleMiddleware([Roles.SUPER_ADMIN]), enterprisesController.createEnterprise)
  router.delete('/:id', Authenticator.requiredRoleMiddleware([Roles.SUPER_ADMIN]), enterprisesController.deleteEnterprise)
  router.put('/:id', Authenticator.hasSomeRolesMiddleware([Roles.SUPER_ADMIN, Roles.ADMIN]), enterprisesController.updateEnterprise)
  router.get('/:id', enterprisesController.getEnterprise)
  return router
}
