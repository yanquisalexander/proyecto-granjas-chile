import WebServer from './app/modules/WebServer.module'
import { initializeSiteSettings } from './app/services/siteSettings'
import { Configuration } from './config'
import Database from './lib/DatabaseManager'

const bootApplication = async (): Promise<void> => {
  console.log('Booting application...')
  await Database.connect()
  const web = await WebServer.createWebServer({
    applicationUrl: Configuration.APPLICATION_URL,
    corsOrigins: Configuration.CORS_ALLOWED_ORIGINS
  })
  await web.start()
  await initializeSiteSettings()
  console.log('Application booted')
}

bootApplication()
