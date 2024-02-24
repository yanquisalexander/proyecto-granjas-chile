import pg, { type QueryResult } from 'pg'
import 'dotenv/config'
import chalk from 'chalk'
import { Configuration } from '@/config'
import { Loggers } from '@/app/initializers/create_loggers'
const { Pool } = pg

class Database {
  private static pool: pg.Pool | null = null

  static async connect (): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!Database.pool) {
        Database.pool = new Pool({
          database: Configuration.DATABASE_NAME,
          host: Configuration.DATABASE_HOST,
          port: Configuration.DATABASE_PORT,
          user: Configuration.DATABASE_USER,
          password: Configuration.DATABASE_PASS,
          connectionTimeoutMillis: 5000,
          log: (msg) => {
            Loggers.Database.writeLog(msg)
            console.log(chalk.green('[DATABASE MANAGER]'), chalk.yellow(msg))
          }
        })

        this.pool?.connect().catch((error) => {
          console.error(chalk.red('[DATABASE MANAGER]'), error)
          Loggers.Database.writeLog(error)
          process.exit(1)
        })

        // Manejo de errores en la conexión
        Database.pool.on('error', (err: any) => {
          console.error('Unexpected error on idle client', err)
        })

        Database.pool.on('remove', () => {
          console.log(chalk.green('[DATABASE MANAGER]'), chalk.yellow('Cliente desconectado'))
        })

        Database.pool.on('connect', () => {
          console.log(chalk.green('[DATABASE MANAGER]'), chalk.yellow('Conectado a la base de datos'))
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  static async query (text: string, params: any[] = [], skipLog: boolean = false): Promise<QueryResult> {
    if (!Database.pool) {
      return await Promise.reject(new Error('Database pool not initialized'))
    }

    const client = await Database.pool.connect()

    try {
      if (!skipLog) {
        console.log(chalk.green('[DATABASE MANAGER]'), chalk.white('Executing query'))
        const startTime = Date.now()
        const result = await client.query(text, params)
        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(chalk.grey(`>>> QUERY ${text.replace(/\$[0-9]+/g, (match) => {
          const index = parseInt(match.replace('$', ''))
          return params[index - 1]
        })}`))
        console.log(chalk.grey(`>>> PARAMS ${JSON.stringify(params)}`))
        console.log(chalk.grey(`>>> ROWS AFFECTED ${result.rowCount}`))
        console.log(chalk.grey(`>>> TIME TAKEN ${duration}ms`))

        return result
      } else {
        return await client.query(text, params)
      }
    } catch (error) {
      console.error(chalk.red('[DATABASE MANAGER]'), error)
      throw error
    } finally {
      client.release()
    }
  }

  static async runMigration (sql: string, name: string): Promise<void> {
    if (!Database.pool) {
      await Promise.reject(new Error('Database pool not initialized'))
      return
    }
    const client = await Database.pool.connect()

    try {
      await client.query(sql)
      console.log(chalk.grey(`>>> MIGRATED ${name}`))
    } catch (error) {
      console.error(chalk.red('[MIGRATION ERROR]'), error)
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
