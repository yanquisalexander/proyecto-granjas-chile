import { FormsController } from '@/app/controllers/Forms.controller'
import { Authenticator } from "@/lib/Authenticator"
import { Router } from 'express'

export const createFormsRouter = (): Router => {
  const router = Router()
  const formsController = new FormsController()

  router.get('/', formsController.getForms)
  router.get('/to-fill', Authenticator.middleware, formsController.getFormsToFill)
  router.get('/:id', formsController.getForm)

  return router
}
