import { Request, Response, NextFunction } from 'express'
import Form from '../models/Form.model'
import { UUID } from 'crypto'

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
}
