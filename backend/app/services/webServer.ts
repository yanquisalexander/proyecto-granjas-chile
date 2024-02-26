import { Configuration } from '@/config'
import WebServer from '../modules/WebServer.module'

let webServerInstance: WebServer | null = null

export const createWebServer = async (): Promise<void> => {
  webServerInstance = await WebServer.createWebServer({
    applicationUrl: Configuration.APPLICATION_URL,
    corsOrigins: Configuration.CORS_ALLOWED_ORIGINS
  })
}

export const getWebServerInstance = (): WebServer | null => {
  return webServerInstance
}

export const restartWebServer = async (): Promise<void> => {
  if (webServerInstance) {
    await webServerInstance.stop()
    await createWebServer()
  }
}

export const stopWebServer = async (): Promise<void> => {
  if (webServerInstance) {
    await webServerInstance.stop()
  }
}

export const startWebServer = async (): Promise<void> => {
  if (webServerInstance) {
    await webServerInstance.start()
  }
}
