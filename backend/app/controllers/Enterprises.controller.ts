import { Request, Response, NextFunction } from 'express'
import Enterprise from '../models/Enterprise.model'

export class EnterprisesController {
  async getEnterprises (req: Request, res: Response, next: NextFunction): Promise<void> {
    const enterprises = await Enterprise.getAll()
    res.json(enterprises)
  }

  async createEnterprise (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, description, company_logo } = req.body
    const id = crypto.randomUUID()
    const enterprise = new Enterprise({ id, name, description, company_logo })
    try {
      await enterprise.create()
      res.json(enterprise)
    } catch (error) {
      if (error) {
        res.status(400).json({
          message: (error as Error).message,
          error_type: (error as Error).name
        })
      }
    }
  }
}
