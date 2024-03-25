import { Request, Response, NextFunction } from 'express'
import Enterprise from '@/app/models/Enterprise.model'
import { UUID } from 'node:crypto'
import fs from 'fs'
import User from '@/app/models/User.model'

export class AdminUsersController {
    async getUsers (req: Request, res: Response, next: NextFunction): Promise<void> {
        const users = await User.getAll()
        res.json(users)
    }
}