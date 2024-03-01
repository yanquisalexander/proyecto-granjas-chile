import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateFormStepsTable extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE TABLE form_steps (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        form_id UUID REFERENCES forms(id)
      )
    `)
  }

  static async down (): Promise<void> {
    await Database.query('DROP TABLE form_steps')
  }
}

export default CreateFormStepsTable
