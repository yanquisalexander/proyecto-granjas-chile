import { initializeSiteSettings } from './app/services/siteSettings'
import { createWebServer, getWebServerInstance, startWebServer } from './app/services/webServer'
import { Authenticator } from './lib/Authenticator'
import Database from './lib/DatabaseManager'

const bootApplication = async (): Promise<void> => {
  console.log('Booting application...')
  await Database.connect()
  await createWebServer()
  Authenticator.initialize()

  await startWebServer()

  await initializeSiteSettings()
  console.log('Application booted')

  getWebServerInstance()?.addRoute('get', '/test', async (req, res) => {
    return res.send('Hello, world!')
  })
}

bootApplication()
