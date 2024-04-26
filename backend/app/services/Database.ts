import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'
import Database from '@/lib/DatabaseManager'
import { Loggers } from "./loggers"

if (!Database.pool) {
  Database.connect()
}

export const dbService = drizzle(Database.pool, { 
  schema,
  logger: {
    logQuery: (query, params) => {
      // @ts-ignore
      Loggers.Database.writeLog(`
        Executing query

        >>> QUERY ${query}
        >>> PARAMS ${JSON.stringify(params)}
      `)
    }
  }
 })