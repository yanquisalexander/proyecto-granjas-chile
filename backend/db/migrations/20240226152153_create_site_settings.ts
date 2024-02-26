import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateSiteSettings extends Migration {
  static async up (): Promise<void> {
    // Implementa la lógica de migración hacia adelante
    // Ejemplo: Crear la tabla site_settings
    await Database.query(`
      CREATE TABLE site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  static async down (): Promise<void> {
    // Implementa la lógica de reversión de la migración
    // Ejemplo: Eliminar la tabla site_settings
    await Database.query('DROP TABLE IF EXISTS site_settings')
  }
}

export default CreateSiteSettings
