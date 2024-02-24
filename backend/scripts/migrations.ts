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
  // Implementa la lógica para aplicar las migraciones pendientes
  console.log('Migración realizada')
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

  /*
    si tiene mas argumentos despues del nombre de la migracion,
    los une en un solo string separado por guiones bajos y
    lo asigna a migrationName, por ejemplo:
    Crear Tabla de Usuarios => crear_tabla_de_usuarios
  */

  if (process.argv.length > 4) {
    const migrationNameArray = process.argv.slice(3)
    migrationName = migrationNameArray.join('_').toLowerCase()
  }
  createMigration(migrationName)
    .catch(console.error)
}
