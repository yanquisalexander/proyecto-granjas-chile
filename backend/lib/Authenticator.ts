import Role from '@/app/models/Role.model'
import User from '@/app/models/User.model'
import { Configuration } from '@/config'
import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import { UUID } from 'node:crypto'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

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
}

export class Authenticator {
  private readonly user?: User

  constructor (user?: User) {
    this.user = user
  }

  async currentUser (): Promise<CurrentUser | null> {
    if (!this.user) return null
    const roles = await this.user.getRoles()
    console.log(roles)
    return {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      created_at: this.user.created_at,
      updated_at: this.user.updated_at,
      roles
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
    return await bcrypt.compare(password, hash)
  }

  static async middleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      if (err || !user) {
        res.status(401).json({ message: 'Unauthorized' })
      } else {
        req.user = user
        next()
      }
    })(req, res, next)
  }

  static initialize () {
    console.log('Initializing authenticator...')
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Configuration.JWT_SECRET,
      passReqToCallback: true
    }, async (req, jwtPayload: JwtPayload, done) => {
      try {
        const user = await User.find(jwtPayload.user_id)
        done(null, user || false)
      } catch (error) {
        done(error, false)
      }
    }))
  }
}
