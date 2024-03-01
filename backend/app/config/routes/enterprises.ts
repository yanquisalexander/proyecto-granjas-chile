import { EnterprisesController } from '@/app/controllers/Enterprises.controller'
import { Router } from 'express'

export const createEnterprisesRouter = (): Router => {
  const router = Router()
  const enterprisesController = new EnterprisesController()

  router.get('/', enterprisesController.getEnterprises)
  router.post('/', enterprisesController.createEnterprise)

  return router
}
