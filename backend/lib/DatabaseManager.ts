import pg, { QueryResult } from 'pg'
import 'dotenv/config'
import chalk from 'chalk'
import { Configuration } from '@/config'
import { Loggers } from '@/app/services/loggers'

const { Pool } = pg

class Database {
  private static pool: pg.Pool | null = null

  private constructor () {
    // Private constructor to prevent instantiation
  }

  private static initializePool (): void {
    if (!Database.pool) {
      Database.pool = new Pool({
        database: Configuration.DATABASE_NAME,
        host: Configuration.DATABASE_HOST,
        port: Configuration.DATABASE_PORT,
        user: Configuration.DATABASE_USER,
        password: Configuration.DATABASE_PASS,
        connectionTimeoutMillis: 5000
      })

      Database.pool.on('error', (err: any) => {
        console.error('Unexpected error on idle client', err)
        Loggers.Database.writeLog(err.message)
      })

      Database.pool.on('remove', () => {
        console.log(chalk.green('[DATABASE MANAGER]'), chalk.yellow('Cliente desconectado'))
        Loggers.Database.writeLog('Cliente desconectado')
      })

      Database.pool.on('connect', () => {
        console.log(chalk.green('[DATABASE MANAGER]'), chalk.yellow('Conectado a la base de datos'))
        Loggers.Database.writeLog('Conectado a la base de datos')
      })
    }
  }

  static async connect (): Promise<void> {
    Database.initializePool()

    if (!Database.pool) {
      const message = 'Database pool not initialized'
      Loggers.Database.writeLog(message)
      throw new Error(message)
    }

    try {
      await Database.pool.connect()
    } catch (error) {
      Configuration.IS_PRODUCTION ? console.error(chalk.red('[DATABASE MANAGER]'), 'An error occurred while connecting to the database. Check the logs for more details') : console.error(chalk.red('[DATABASE MANAGER]'), error)
      Loggers.Database.writeLog((error as Error).message)
      throw error
    }
  }

  static async query (text: string, params: any[] = [], skipLog: boolean = false): Promise<QueryResult> {
    if (!Database.pool) {
      throw new Error('Database pool not initialized')
    }

    const client = await Database.pool.connect()

    try {
      if (!skipLog) {
        console.log(chalk.green('[DATABASE MANAGER]'), chalk.white('Executing query'))
        const startTime = Date.now()
        const result = await client.query(text, params)
        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(chalk.grey(`>>> QUERY ${text.replace(/\$[0-9]+/g, (match) => params[parseInt(match.replace('$', '')) - 1])}`))
        console.log(chalk.grey(`>>> PARAMS ${JSON.stringify(params)}`))
        console.log(chalk.grey(`>>> ROWS AFFECTED ${result.rowCount}`))
        console.log(chalk.grey(`>>> TIME TAKEN ${duration}ms`))

        Loggers.Database.writeLog(`
        Executing query
        
        >>> QUERY ${text.replace(/\$[0-9]+/g, (match) => params[parseInt(match.replace('$', '')) - 1])}
        >>> PARAMS ${JSON.stringify(params)}
        >>> ROWS AFFECTED ${result.rowCount}
        >>> TIME TAKEN ${duration}ms

        `)

        return result
      } else {
        return await client.query(text, params)
      }
    } catch (error) {
      Loggers.Database.writeLog((error as Error).message)
      console.error(chalk.red('[DATABASE MANAGER]'), error)
      throw error
    } finally {
      client.release()
    }
  }

  static async runMigration (sql: string, name: string): Promise<void> {
    Database.initializePool()

    if (!Database.pool) {
      throw new Error('Database pool not initialized')
    }

    const client = await Database.pool.connect()

    try {
      await client.query(sql)
      console.log(chalk.grey(`>>> MIGRATED ${name}`))
      Loggers.Database.writeLog(`
       >>> MIGRATED ${name}
      `)
    } catch (error) {
      Loggers.Database.writeLog((error as Error).message)
      console.error(chalk.red('[MIGRATION ERROR]'), error)
      throw error
    } finally {
      client.release()
    }
  }

  static async close (): Promise<void> {
    if (Database.pool) {
      await Database.pool.end()
    }
  }
}

export default Database
