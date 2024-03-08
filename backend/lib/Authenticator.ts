import Enterprise from '@/app/models/Enterprise.model'
import Role, { Roles } from '@/app/models/Role.model'
import User from '@/app/models/User.model'
import WorkGroup from '@/app/models/WorkGroup.model'
import { Configuration } from '@/config'
import bcrypt from 'bcrypt'
import chalk from 'chalk'
import { Request, Response, NextFunction } from 'express'
import { UUID } from 'node:crypto'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import * as readlineSync from 'readline-sync'

const SALT_ROUNDS = 10

interface JwtPayload {
  user_id: UUID
  iat: number
  exp: number
}

export interface CurrentUser {
  id: UUID
  username: string
  email: string
  created_at?: Date
  updated_at?: Date
  roles?: Role[]
  workgroups?: WorkGroup[]
  enterprise?: Enterprise | null
}

export class Authenticator {
  private readonly user?: User

  constructor (user?: User) {
    this.user = user
  }

  async currentUser (): Promise<CurrentUser | null> {
    if (!this.user) return null
    const roles = await this.user.getRoles()
    const workgroups = await this.user.getWorkGroups()
    const enterprise = await this.user.getEnterprise()
    console.log(roles)
    return {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      created_at: this.user.created_at,
      updated_at: this.user.updated_at,
      roles,
      workgroups,
      enterprise
    }
  }

  get isAuthenticated (): boolean {
    return !!this.user
  }

  async hasNeededRoles (roles: Role[]): Promise<boolean> {
    if (!this.user) return false
    const userRoles = await this.user.getRoles()
    return userRoles.some(userRole => roles.some(role => role.name === userRole.name))
  }

  static async hashPassword (password: string): Promise<string> {
    if (!password) throw new Error('Password is required')
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return await bcrypt.hash(password, salt)
  }

  static async comparePassword (password: string, hash: string): Promise<boolean> {
    console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Comparing password...'))
    return await bcrypt.compare(password, hash)
  }

  static async middleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('Middleware called'))
      console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('Error:'), err)
      console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('User:'), user)
      if (err || !user) {
        console.log(' 😐Error:', err)
        console.log(' 😐User:', user)
        res.status(401).json({
          errors: [
            "Looks like you're not authenticated. Please log in and try again."
          ],
          error_type: err
        })
      } else {
        req.user = user
        next()
      }
    })(req, res, next)
  }

  static requiredRoleMiddleware (roles: Roles[]) {
    // Roles is an Enum array
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Role middleware called'))
      const user = req.user as User
      const userRoles = await user.getRoles()
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('User roles:'), userRoles)
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Required roles:'), roles)
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Checking if user has necessary roles...'))
      const hasNecessaryRoles = userRoles.some(userRole => roles.some(role => role === userRole.name))
      if (hasNecessaryRoles) {
        next()
      } else {
        res.status(401).json({
          message: "Your account doesn't have the necessary permissions to access this resource."
        })
      }
    }
  }

  static hasSomeRolesMiddleware (roles: Roles[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Role middleware called'))
      const user = req.user as User
      const userRoles = await user.getRoles()
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('User roles:'), userRoles)
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Required roles:'), roles)
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Checking if user has at least one necessary role...'))
      const hasAtLeastOneRole = userRoles.some(userRole => roles.some(role => role === userRole.name))

      if (hasAtLeastOneRole) {
        next()
      } else {
        res.status(401).json({
          message: "Your account doesn't have the necessary permissions to access this resource."
        })
      }
    }
  }

  static async initialize () {
    console.log('Initializing authenticator...')
    passport.use('jwt', new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Configuration.JWT_SECRET,
      passReqToCallback: true
    }, async (req, jwtPayload: JwtPayload, done) => {
      console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('JWT strategy called'))
      console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('Payload:'), jwtPayload)
      try {
        const user = await User.find(jwtPayload.user_id)
        console.log(chalk.bgCyan.bold('[PASSPORT]'), chalk.white('User found:'), user)
        done(null, user || null)
      } catch (error) {
        done(error, false)
      }
    }))

    const usersCount = await User.count()
    console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Users count:'), usersCount)

    if (usersCount === 1) {
      console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('Only system user found. You should create a new user.'))
      // Require the user to create a new user before continuing

      const username = readlineSync.question('Username: ')
      const email = readlineSync.question('Email: ')
      let password = readlineSync.question('Password: ', {
        hideEchoBack: true
      })
      const confirmPassword = readlineSync.question('Confirm password: ', {
        hideEchoBack: true
      })

      if (password !== confirmPassword) {
        console.log('Passwords do not match. Please restart the server and try again.')
        process.exit(1)
      }

      password = await Authenticator.hashPassword(password)

      const user = new User({
        id: User.generateId(),
        username,
        email,
        password
      })

      try {
        await user.save()
        console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white('User created successfully'))
        await user.addRole(Roles.SUPER_ADMIN)
        console.log(chalk.bgCyan.bold('[AUTHENTICATOR]'), chalk.white(`User ${username} has been granted the SUPER_ADMIN role`))
      } catch (error) {
        console.error(chalk.bgRed.bold('[AUTHENTICATOR]'), chalk.white('Error creating user:'), error)
        process.exit(1)
      }
    }
  }
}
