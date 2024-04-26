import { Request, Response, NextFunction } from 'express'
import Form from '../models/Form.model'
import { UUID } from 'crypto'
import User from "../models/User.model"
import { Authenticator } from "@/lib/Authenticator"

export class FormsController {
  async getForms (req: Request, res: Response, next: NextFunction): Promise<void> {
    const forms = await Form.getAll()
    res.json(forms)
  }

  async getForm (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const form = await Form.findById(req.params.id as UUID)
      if (!form) {
        res.status(404).json({ message: 'Form not found' })
        return
      }
      const steps = await form.getSteps()
      form.steps = steps

      const fields = await Promise.all(steps.map(async step => {
        const formFields = await step.getFields()
        return formFields
      }))
      form.steps = form.steps.map((step, index) => {
        step.fields = fields[index]
        return step
      })

      res.json(form)
    } catch (error) {
      next(error)
    }
  }

  async getFormsToFill (req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await User.find((req.user?.id))

    if (!user) {
      res.status(401).json({ message: 'The user that you are trying to access does not exist or has been deleted.' })
      return
    }

    const userAuthenticator = new Authenticator(user)

    const currentUser = await userAuthenticator.currentUser() as User

    console.log('Current user:', currentUser)
    console.log('Current user workgroups:', currentUser.workgroups)

    // If user doesn't have a workgroup assigned, return an empty array
    if (!currentUser.workgroups || currentUser.workgroups.length === 0) {
      res.json([])
      return
    }

    const forms = await Form.getFormsToFill(currentUser.workgroups)

    res.json(forms)
  }
}
