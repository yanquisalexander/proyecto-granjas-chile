import WebServer from './app/modules/WebServer.module'
import { Configuration } from './config'
import Database from './lib/DatabaseManager'

const bootApplication = async (): Promise<void> => {
  console.log('Booting application...')
  await WebServer.createWebServer({
    applicationUrl: Configuration.APPLICATION_URL
  })
  await WebServer.start()
  console.log('Application booted')
}

bootApplication()
