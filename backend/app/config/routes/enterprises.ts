import { EnterprisesController } from '@/app/controllers/Enterprises.controller'
import { Router } from 'express'

export const createEnterprisesRouter = (): Router => {
  const router = Router()
  const controller = new EnterprisesController()

  router.get('/', controller.getEnterprises)
  router.post('/', controller.createEnterprise)

  return router
}
