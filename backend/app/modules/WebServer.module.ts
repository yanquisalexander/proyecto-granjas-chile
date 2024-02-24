import express, { Express, Request, Response, NextFunction } from 'express'
import http from 'http'
import cors from 'cors'
import { Configuration } from '@/config'
import FormatApiResponseMiddleware from '../middlewares/FormatApiResponse.middleware'
import LogRequestsMiddleware from '../middlewares/LogRequests.middleware'
import { Loggers } from '../initializers/create_loggers'

class WebServer {
  private readonly app: Express
  private readonly port: number
  private ioServer: http.Server | null
  private isRunning: boolean
  private readonly middlewares: any[]

  private constructor (app: Express, port: number) {
    this.app = app
    this.port = port
    this.ioServer = null
    this.isRunning = false
    this.middlewares = []
  }

  public static async createWebServer ({
    applicationUrl,
    port = 3000,
    corsOrigins = Configuration.IS_PRODUCTION ? [applicationUrl] : ['*']
  }: {
    applicationUrl: string
    port?: number
    corsOrigins?: string[]
  }): Promise<WebServer> {
    const app = express()
    const webServer = new WebServer(app, port)

    app.set('applicationUrl', applicationUrl)

    webServer.applyMiddlewares([
      express.json(),
      express.urlencoded({ extended: true }),
      LogRequestsMiddleware
    ])

    webServer.setupCORS(applicationUrl, corsOrigins)

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        error: err.message
      })
    })

    app.all('*', (req: Request, res: Response) => {
      res.status(404).json({
        errors: ['Apparently the requested URL or Resource could not be found.'],
        error_type: 'not_found'
      })
    })

    app.use(FormatApiResponseMiddleware)

    return webServer
  }

  private setupCORS (applicationUrl: string, corsOrigins: string[]): void {
    if (Configuration.ENABLE_CORS) {
      this.applyMiddlewares([
        cors({
          origin: [applicationUrl, ...corsOrigins],
          optionsSuccessStatus: 200
        })
      ])
    } else {
      Loggers.WebServer.writeLog('ENABLE_CORS is set to false on environment variables. Skipping CORS middleware...')
    }
  }

  public async start (): Promise<void> {
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

  private applyMiddlewares (middlewares: any[]): void {
    middlewares.forEach((middleware) => {
      this.app.use(middleware)
      this.middlewares.push(middleware)
    })
  }
}

export default WebServer
