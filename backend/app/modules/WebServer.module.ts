import express, { Express } from 'express'
import http from 'http'
import cors from 'cors'
import { Configuration } from '@/config'
import FormatApiResponseMiddleware from '../middlewares/FormatApiResponse.middleware'
import LogRequestsMiddleware from '../middlewares/LogRequests.middleware'
import { Loggers } from '../initializers/create_loggers'

class WebServer {
  public static app: Express
  public static port: number
  public static isRunning: boolean
  public static ioServer: http.Server | null
  public static middlewares: any[]

  private constructor () {
    throw new Error('This class cannot be instantiated. Use createWebServer() method instead.')
  }

  public static async createWebServer ({
    applicationUrl,
    port = 3000,
    corsOrigins = Configuration.IS_PRODUCTION ? [applicationUrl] : ['*']
  }: {
    applicationUrl: string
    port?: number
    corsOrigins?: string[]
  }): Promise<Express> {
    this.app = express()
    this.port = port
    this.isRunning = false
    this.ioServer = null
    this.app.set('applicationUrl', applicationUrl)
    this.middlewares = []
    this.applyMiddlewares([
      express.json(),
      express.urlencoded({ extended: true }),
      LogRequestsMiddleware,
      FormatApiResponseMiddleware
    ])

    if (Configuration.ENABLE_CORS) {
      this.applyMiddlewares([
        cors({
          origin: corsOrigins,
          optionsSuccessStatus: 200
        })
      ])
    }
    return this.app
  }

  public static async start () {
    if (!this.isRunning) {
      Loggers.WebServer.writeLog('Starting server...')
      if (!this.app) {
        Loggers.WebServer.writeLog('Server not initialized. Did you forget to call createWebServer() method?')
        throw new Error('Server not initialized. Did you forget to call createWebServer() method?')
      }

      this.ioServer = http.createServer(this.app)
      await new Promise<void>((resolve) => {
        if (!this.ioServer) {
          throw new Error('Server not initialized. Did you forget to call createWebServer() method?')
        }

        this.ioServer.listen(this.port, () => {
          Loggers.WebServer.writeLog(`Server running at ${this.app.get('applicationUrl')}:${this.port}`)
          console.log(`Server running at ${this.app.get('applicationUrl')}:${this.port}`)
          resolve()
        })
      })

      this.isRunning = true
    }
  }

  public static applyMiddlewares (middlewares: any[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware)
      this.middlewares.push(middleware)
    })
  }
}

export default WebServer
