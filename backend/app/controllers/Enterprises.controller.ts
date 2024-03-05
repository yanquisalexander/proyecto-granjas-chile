import { Request, Response, NextFunction } from 'express'
import Enterprise from '../models/Enterprise.model'
import { UUID } from 'node:crypto'

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

  async deleteEnterprise (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const enterprise = await Enterprise.findById(id as UUID)
    if (!enterprise) {
      res.status(404).json({
        message: 'Enterprise not found.'
      })
      return
    }

    try {
      await enterprise.delete()
      res.status(204).send()
    } catch (error) {
      if (error) {
        res.status(500).json({
          message: (error as Error).message,
          error_type: (error as Error).name
        })
      }
    }
  }

  async updateEnterprise (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const { name, description, company_logo } = req.body
    const enterprise = await Enterprise.findById(id as UUID)
    if (!enterprise) {
      res.status(404).json({
        message: 'Enterprise not found.'
      })
      return
    }

    try {
      console.log(req.body)
      enterprise.name = name
      enterprise.description = description
      if (company_logo) {
        // Upload company logo to local storage or cloud storage
        enterprise.company_logo = company_logo
      }
      enterprise.updated_at = new Date()
      await enterprise.update()
      res.json(enterprise)
    } catch (error) {
      if (error) {
        res.status(500).json({
          message: (error as Error).message,
          error_type: (error as Error).name
        })
      }
    }
  }

  async getEnterprise (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const enterprise = await Enterprise.findById(id as UUID)
    if (!enterprise) {
      res.status(404).json({
        message: 'Enterprise not found.'
      })
      return
    }
    res.json(enterprise)
  }
}
