import { Configuration } from '@/config'
import * as fs from 'node:fs'
import * as path from 'node:path'

const __dirname = path.resolve()

class Logger {
  private readonly logFilePath: string

  constructor (logFileName: string = 'log') {
    const logsDirectory = path.join(__dirname, 'logs')
    logFileName = logFileName.toLowerCase()

    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory)
    }

    const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]

    if (logFileName) {
      this.logFilePath = path.join(logsDirectory, `${logFileName}_${timestamp}.txt`)
    } else {
      this.logFilePath = path.join(logsDirectory, `log_${timestamp}.txt`)
    }

    // Llama a clearOldLogs después de asegurarse de que el directorio existe
    this.clearOldLogs({
      logsToKeep: Configuration.MAX_LOGS_TO_KEEP,
      filePrefix: logFileName
    })
  }

  writeLog (message: string): void {
    const logMessage = `[${new Date().toLocaleString()}] ${message}\n`
    console.log(logMessage)
    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err)
      }
    })
  }

  clearOldLogs ({ logsToKeep = 5, filePrefix = 'log' } = {}): void {
    const logDirectory = path.dirname(this.logFilePath)

    fs.readdir(logDirectory, (err, files) => {
      if (err) {
        console.error('Error reading log files:', err)
        return
      }

      const logFiles = files.filter((file) => file.startsWith(filePrefix) && file.endsWith('.txt'))
      logFiles.sort().reverse()

      logFiles.slice(logsToKeep).forEach((file) => {
        fs.unlink(path.join(logDirectory, file), (err) => {
          if (err) {
            console.error('Error deleting log file:', err)
          }
        })
      })
    })
  }
}

export default Logger
