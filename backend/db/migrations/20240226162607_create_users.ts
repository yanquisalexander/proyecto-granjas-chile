import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateUsers extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  static async down (): Promise<void> {
    await Database.query('DROP TABLE IF EXISTS users')
  }
}

export default CreateUsers
