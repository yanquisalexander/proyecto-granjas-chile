import Logger from '@/lib/Logger'

export const Loggers = {
  Database: new Logger('database'),
  WebServer: new Logger('webserver')
}
