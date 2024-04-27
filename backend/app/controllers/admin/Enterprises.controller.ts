import { Request, Response, NextFunction } from 'express'
import Enterprise from '@/app/models/Enterprise.model'
import { UUID } from 'node:crypto'
import fs from 'fs'
import User from '@/app/models/User.model'

export class AdminEnterprisesController {
  async getEnterprises(req: Request, res: Response, next: NextFunction): Promise<void> {
    const enterprises = await Enterprise.getAll()

    const enterprisesWithAdmins = await Promise.all(enterprises.map(async (enterprise) => {
      const admins = await enterprise.getAdmins()
      return {
        ...enterprise,
        admins
      }
    }))

    res.json(enterprisesWithAdmins)
  }

  async createEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, description } = req.body
    let company_logo = "https://cdn.icon-icons.com/icons2/1863/PNG/512/business_119337.png"
    // Default logo when creating enterprise
    const id = crypto.randomUUID()
    const enterprise = new Enterprise({ id, name, company_logo })
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

  async deleteEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  async updateEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const { name, description } = req.body
    const enterprise = await Enterprise.findById(id as UUID)
    if (!enterprise) {
      res.status(404).json({
        message: 'Enterprise not found.'
      })
      return
    }

    try {
      console.log(req.files)
      enterprise.name = name || enterprise.name
      enterprise.description = description || enterprise.description
      // has logo field in req.files? (using find)
      if (Array.isArray(req.files) && req.files.length > 0) {
        const file = req.files[0]
        const fileExtension = file.originalname.split('.').pop()
        const filename = `company_logo_${enterprise.id}.${fileExtension}`

        const fileUrl = `/uploads/company_logos/${filename}`
        enterprise.company_logo = fileUrl

        // create file to public/uploads/company_logos
        fs.writeFileSync(`public/uploads/company_logos/${filename}`, file.buffer)
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

  async getEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    try {
      const enterprise = await Enterprise.findById(id as UUID)
      if (!enterprise) {
        res.status(404).json({
          message: 'Enterprise not found.'
        })
        return
      }

      const admins = await enterprise.getAdmins()

      res.json({
        ...enterprise,
        admins
      })
    } catch (error) {
      if (error) {
        res.status(500).json({
          message: (error as Error).message,
          error_type: (error as Error).name
        })
      }
    }
  }

  async getMyEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.find(req.user.id)
      const enterprise = await user?.getEnterprise()
      if (!enterprise) {
        res.status(404).json({
          message: 'Enterprise not found.'
        })
        return
      }
      res.json(enterprise)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: (error as Error).message,
        error_type: (error as Error).name
      })
    }
  }

  async updateMyEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.find(req.user.id)
      const enterprise = await user?.getEnterprise()
      if (!enterprise) {
        res.status(404).json({
          message: 'Enterprise not found.'
        })
        return
      }

      const { name, description } = req.body
      enterprise.name = name || enterprise.name
      enterprise.description = description || enterprise.description
      enterprise.updated_at = new Date()
      await enterprise.update()
      res.json(enterprise)
    } catch (error) {
      res.status(500).json({
        message: (error as Error).message,
        error_type: (error as Error).name
      })
    }
  }

  async addAdminToEnterprise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
  
      const enterprise = await Enterprise.findById(id as UUID);
      const user = await User.find(user_id);
  
      if (!enterprise) {
        res.status(404).json({ message: 'Enterprise not found.' });
        return;
      }
  
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
  
      const isSystemUser = await user.isSystemUser();
      if (isSystemUser) {
        res.status(400).json({ message: 'System user cannot be an admin of an enterprise.' });
        return;
      }
  
      const userEnterprise = await user.getEnterprise();
      const enterpriseAdmins = await enterprise.getAdmins();
  
      if (userEnterprise && userEnterprise.id !== enterprise.id) {
        res.status(400).json({ message: 'User is already an admin of another enterprise.' });
        return;
      }
  
      if (enterpriseAdmins.some(admin => admin.id === user.id)) {
        res.status(400).json({ message: 'User is already an admin of this enterprise.' });
        return;
      }
  
      await enterprise.addAdmin(user);
      res.json(enterprise);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Internal server error',
        error_type: error instanceof Error ? error.name : 'Unknown'
      });
    }
  }
  
  
}
