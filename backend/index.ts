import { initializeSiteSettings } from './app/services/siteSettings'
import { createWebServer, getWebServerInstance, startWebServer } from './app/services/webServer'
import { Authenticator } from './lib/Authenticator'
import Database from './lib/DatabaseManager'
import { System } from "./lib/System"

const bootApplication = async (): Promise<void> => {
  console.log('Booting application...')
  Database.connect()
  await createWebServer()
  await Authenticator.initialize()

  await startWebServer()

  await initializeSiteSettings()

  System.printInfo()


  getWebServerInstance()?.addRoute('get', '/test', async (req, res) => {
    return res.send('Hello, world!')
  })
}

bootApplication()
