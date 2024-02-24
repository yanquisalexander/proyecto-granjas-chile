import * as fs from 'node:fs'
import * as path from 'node:path'

const __dirname = path.resolve()

class Logger {
  private readonly logFilePath: string

  constructor (logFileName?: string) {
    const logsDirectory = path.join(__dirname, 'logs')

    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory)
    }
    const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]

    if (logFileName) {
      this.logFilePath = path.join(logsDirectory, `${logFileName}_${timestamp}.txt`)
    } else {
      this.logFilePath = path.join(logsDirectory, `log_${timestamp}.txt`)
    }
  }

  writeLog (message: string): void {
    const logMessage = `[${new Date().toLocaleString()}] ${message}\n`
    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err)
      }
    })
  }
}

export default Logger
