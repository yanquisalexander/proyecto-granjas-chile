import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'
import chalk from 'chalk'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import * as readlineSync from 'readline-sync'

const __dirname = path.resolve()

const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]

const toPascalCase = (str: string): string => {
  return str.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

export async function createMigration (name: string): Promise<void> {
  const migrationFileName = `${timestamp}_${name}.ts`
  const migrationPath = path.join(__dirname, 'db/migrations', migrationFileName)

  const migrationContent = `import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class ${toPascalCase(name)} extends Migration {
  static async up (): Promise<void> {
    // Write your migration logic here
  }

  static async down (): Promise<void> {
    // Write the logic to revert the migration here
  }
}

export default ${toPascalCase(name)}
`

  fs.writeFileSync(migrationPath, migrationContent, 'utf-8')

  console.log(`Migration file created at: ${migrationPath}`)
  console.log('Remember to implement the "up" and "down" methods in the generated file.')
}

export async function rollbackMigration (): Promise<void> {
  // Implementa la lógica para revertir la última migración aplicada
  console.log('Rollback realizado')
}

export async function migrate (): Promise<void> {
  console.log('Migrating database...')

  try {
    await Database.connect()
    console.log('Database connected')
  } catch (error) {
    console.error(chalk.red('[MIGRATIONS]'), 'Error connecting to the database')
    process.exit(1)
  }

  const migrationsDirectory = path.join(__dirname, 'db/migrations')
  const migrationHistoryPath = path.join(__dirname, 'db', '.migration_history')

  const migrationFiles = fs.readdirSync(migrationsDirectory).filter((file) => file.endsWith('.ts'))
  const appliedMigrations = fs.existsSync(migrationHistoryPath)
    ? fs.readFileSync(migrationHistoryPath, 'utf-8').split('\n').filter(Boolean)
    : []

  const pendingMigrations = migrationFiles
    .filter((migration) => !appliedMigrations.includes(migration))
    .sort()

  console.log(chalk.grey('[MIGRATIONS]'), `Trying to apply ${pendingMigrations.length} migration(s)`)

  const successfulMigrations: string[] = []

  for (const migrationFile of pendingMigrations) {
    let migrationPath = path.join(migrationsDirectory, migrationFile)

    if (os.platform() === 'win32') {
      migrationPath = `file://${migrationPath}`
    }

    const migrationModule = (await import(migrationPath)).default as typeof Migration
    console.log(chalk.grey('[MIGRATIONS]'), `Applying migration ${migrationFile}`)

    try {
      await migrationModule.up()
      successfulMigrations.push(migrationFile)
      fs.appendFileSync(migrationHistoryPath, `${migrationFile}\n`)
      console.log(chalk.grey('[MIGRATIONS]'), `Migration ${migrationFile} applied successfully`)
    } catch (error) {
      console.error(chalk.red('[MIGRATIONS]'), `Error applying migration ${migrationFile}:`, error)
      console.log(chalk.grey('[MIGRATIONS]'), 'Rolling back applied migrations...')

      for (const appliedMigration of successfulMigrations) {
        let appliedMigrationPath = path.join(migrationsDirectory, appliedMigration)

        if (os.platform() === 'win32') {
          appliedMigrationPath = `file://${appliedMigrationPath}`
        }

        const appliedMigrationModule = (await import(appliedMigrationPath)).default as typeof Migration
        console.log(chalk.grey('[MIGRATIONS]'), `Rolling back migration ${appliedMigration}`)

        try {
          await appliedMigrationModule.down()
          console.log(chalk.grey('[MIGRATIONS]'), `Migration ${appliedMigration} rolled back successfully`)
        } catch (error) {
          console.error(chalk.red('[MIGRATIONS]'), `Error rolling back migration ${appliedMigration}:`, error)
        }
      }

      process.exit(1)
    }
  }

  console.log(chalk.grey('[MIGRATIONS]'), 'All migrations applied')
  process.exit(0)
}

export async function deleteDatabase (): Promise<void> {
  const confirm = readlineSync.question('Are you sure you want to delete the database content? This action cannot be undone. (yes/no): ')
  if (confirm !== 'yes') {
    console.log('Database deletion cancelled')
    process.exit(0)
  }

  try {
    await Database.connect()
    console.log('Database connected')
    // Delete the content, due to the fact that the database cannot be deleted while being connected
    await Database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
    // Delete the migration history file
    const migrationHistoryPath = path.join(__dirname, 'db', '.migration_history')
    if (fs.existsSync(migrationHistoryPath)) {
      fs.unlinkSync(migrationHistoryPath)
    }

    console.log('Database content deleted')
  } catch (error) {
    console.error(chalk.red('[MIGRATIONS]'), 'Error deleting the database content:', error)
    process.exit(1)
  }

  console.log('[MIGRATIONS]', 'Database content deleted successfully')
  process.exit(0)
}

export const checkPendingMigrations = async (): Promise<void> => {
  // Implementa la lógica para verificar si hay migraciones pendientes
  console.log('Verificación realizada')
}

const command = process.argv[2]

if (!command) {
  console.error(chalk.red('You must provide a command'))
  process.exit(1)
}

if (command === 'create') {
  let migrationName = process.argv[3]

  if (!migrationName) {
    console.error(chalk.red('You must provide a name for the migration'))
    process.exit(1)
  }

  if (process.argv.length > 4) {
    const migrationNameArray = process.argv.slice(3)
    migrationName = migrationNameArray.join('_').toLowerCase()
  }
  createMigration(migrationName)
    .catch(console.error)
} else if (command === 'migrate') {
  migrate()
    .catch(console.error)
} else if (command === 'drop') {
  deleteDatabase()
    .catch(console.error)
} else {
  console.error(chalk.red('Invalid command'))
  process.exit(1)
}
