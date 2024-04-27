import { Request, Response, NextFunction } from 'express'
import Enterprise from '@/app/models/Enterprise.model'
import User from '@/app/models/User.model'
import { Configuration } from "@/config";

export class AdminDashboardController {
    
    async getProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
        const PROBLEMS = []

        if(!Configuration.IS_PRODUCTION) {
            PROBLEMS.push({
                title: 'Entorno de desarrollo',
                message: 'El sistema está corriendo en un entorno de desarrollo. Asegúrate de que la configuración de producción sea correcta.',
                color: 'blue',
                icon: 'i-tabler-flask'
            });
        }

        try {
            const user = await User.find(req.user.id);
            if (!user) {
                res.status(404).json({
                    message: 'User not found.'
                });
                return;
            }

            const isAdmin = await user.isAdmin();
            const isSuperAdmin = await user.isSuperAdmin();

            console.log('isAdmin', isAdmin);
            console.log('isSuperAdmin', isSuperAdmin);

            if (isSuperAdmin) {
                const enterprises = await Enterprise.getAll();
                const enterprisesWithoutAdmins = await getEnterprisesWithoutAdmins(enterprises);
                console.log('enterprisesWithoutAdmins', enterprisesWithoutAdmins);
                if (enterprisesWithoutAdmins.length > 0) {
                    PROBLEMS.push({
                        title: 'Empresas sin administradores',
                        message: 'Algunas empresas no tienen administradores asignados.',
                        color: 'orange',
                    });
                }
            }

            res.json(PROBLEMS);
        } catch (error) {
            next(error);
        }
    }
}
const getEnterprisesWithoutAdmins = async (enterprises: Enterprise[]): Promise<Enterprise[] | undefined> => {
    const enterprisesWithoutAdmins = await Promise.all(enterprises.map(async (enterprise) => {
        const admins = await enterprise.getAdmins()
        console.log('admins', admins)
        if (admins.length === 0) {
            return enterprise
        }
    }))
    
    return enterprisesWithoutAdmins.filter((enterprise): enterprise is Enterprise => enterprise !== undefined)
}
