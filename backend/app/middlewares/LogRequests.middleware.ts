import { type Request, type Response, type NextFunction } from 'express'
import { Loggers } from '../initializers/create_loggers'

export default function LogRequestsMiddleware (req: Request, res: Response, next: NextFunction) {
  Loggers.WebServer.writeLog(`[${req.method}] ${req.originalUrl}`)
  console.log(`[${req.method}] ${req.originalUrl}`)
  next()
}
