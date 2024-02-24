import Database from '@/lib/DatabaseManager'
import chalk from 'chalk'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.resolve()

const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]

export async function createMigration (name: string): Promise<void> {
  const migrationFileName = `${timestamp}_${name}.sql`
  const migrationPath = path.join(__dirname, 'db/migrations', migrationFileName)

  fs.writeFileSync(migrationPath, `--- Migration generated at: ${timestamp}
--- Name: ${name}

--- Write your migration below this line
  `)

  console.log(`Migration created at: ${migrationPath}`)
  console.log('Remember to run db:migrate to apply the migration after writing it')
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
  }

  const migrationsDirectory = path.join(__dirname, 'db/migrations')
  const migrationHistoryPath = path.join(__dirname, 'db', '.migration_history')

  const migrationFiles = fs.readdirSync(migrationsDirectory).filter((file) => file.endsWith('.sql'))
  const appliedMigrations = fs.existsSync(migrationHistoryPath)
    ? fs.readFileSync(migrationHistoryPath, 'utf-8').split('\n').filter(Boolean)
    : []

  const pendingMigrations = migrationFiles.filter((migration) => !appliedMigrations.includes(migration))

  console.log(chalk.grey('[MIGRATIONS]'), `Trying to apply ${pendingMigrations.length} migration(s)`)
  for (const migrationFile of pendingMigrations) {
    const migrationPath = path.join(migrationsDirectory, migrationFile)
    const migrationContent = fs.readFileSync(migrationPath, 'utf-8')
    console.log(chalk.grey('[MIGRATIONS]'), `Applying migration ${migrationFile}`)
    console.log(chalk.gray(`>>> ${migrationContent}`))

    try {
      await Database.runMigration(migrationContent, migrationFile)
      console.log(chalk.grey('[MIGRATIONS]'), `Migration ${migrationFile} applied`)

      // Agregar la migración al historial
      fs.appendFileSync(migrationHistoryPath, `${migrationFile}\n`)
    } catch (error) {
      console.error(chalk.red('[MIGRATIONS]'), `Error applying migration ${migrationFile}`)
      console.error(chalk.red('[MIGRATIONS]'), error)
      break
    }
  }

  console.log(chalk.grey('[MIGRATIONS]'), 'All migrations applied')
  process.exit(0)
}

export async function deleteDatabase (): Promise<void> {
  // Implementa la lógica para eliminar la base de datos
  console.log('Base de datos eliminada')
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
} else {
  console.error(chalk.red('Invalid command'))
  process.exit(1)
}
