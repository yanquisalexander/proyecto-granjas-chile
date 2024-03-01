import { FormsController } from '@/app/controllers/Forms.controller'
import { Router } from 'express'

export const createFormsRouter = (): Router => {
  const router = Router()
  const formsController = new FormsController()

  router.get('/', formsController.getForms)
  router.get('/:id', formsController.getForm)

  return router
}
