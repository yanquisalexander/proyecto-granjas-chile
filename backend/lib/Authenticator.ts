import User from '@/app/models/User.model'
import { Configuration } from '@/config'
import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

/**
 * Authenticator class
 *
 * This class is responsible for authenticating and authorizing users.
 * Use this class to authenticate users, check their roles, and hash their passwords.
 */

const SALT_ROUNDS = 10

export class Authenticator {
  user?: User
  public static passport: typeof passport
  constructor (user?: User) {
    this.user = user
  }

  isAuthenticated (): boolean {
    return !!this.user
  }

  static async hashPassword (password: string): Promise<string> {
    if (!password) throw new Error('Password is required')
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return bcrypt.hash(password, salt)
  }

  static async comparePassword (password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static async middleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' })
      } else if (user) {
        req.user = user
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })(req, res, next)
  }

  static async initialize () {
    this.passport = passport
    this.passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Configuration.JWT_SECRET,
      passReqToCallback: true
    }, async (jwtPayload, done) => {
      const user = await User.find(jwtPayload.user_id)
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    }))
  }
}
