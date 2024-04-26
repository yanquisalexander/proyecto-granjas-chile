import { Configuration } from '@/config'
import Database from "@/lib/DatabaseManager"
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import path from 'node:path'
import * as schema from '@/db/schema'
import { dbService } from "@/app/services/Database"

const __dirname = path.resolve()

console.log('Running migrations...')
console.log('Current configuration:')

console.table(Configuration)


console.log(path.join(__dirname, '../db/drizzle'))
// @ts-ignore
export const runMigrations = migrate(dbService, { migrationsFolder: path.join(__dirname, '/db/drizzle') })
  .then(() => {
    console.log('Migrations ran successfully')
    process.exit(0)
  })
  .catch((error) => { 
    console.error('Error running migrations', error)
    process.exit(1)
 })