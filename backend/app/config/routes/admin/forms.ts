import { AdminFormsController } from "@/app/controllers/admin/Forms.controller"
import { Roles } from '@/app/models/Role.model'
import { Authenticator } from '@/lib/Authenticator'
import { Router } from 'express'

export const createAdminFormsRouter = (): Router => {
    const router = Router()
    const adminFormsController = new AdminFormsController()

    // GET /admin/forms (All forms of my enterprise)
    router.get('/', Authenticator.middleware, adminFormsController.getForms)
    router.post('/', Authenticator.middleware, adminFormsController.createForm)
    router.get('/:formId', Authenticator.middleware, adminFormsController.getForm)
    router.put('/:formId', Authenticator.middleware, adminFormsController.updateForm)

    // POST /admin/forms (Create a new form for my enterprise)


    return router
}
