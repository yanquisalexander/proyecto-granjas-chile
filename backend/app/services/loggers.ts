import { Configuration } from '@/config'
import Logger from '@/lib/Logger'

export const Loggers = {
  Database: new Logger('database'),
  WebServer: new Logger('webserver'),
  Default: new Logger(Configuration.IS_PRODUCTION ? 'production' : 'development'),
  Error: new Logger('error')
}
