import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateFormFieldsTable extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE TABLE form_fields (
        id UUID PRIMARY KEY,
        field_name VARCHAR(255) NOT NULL,
        field_type VARCHAR(255) NOT NULL,
        description TEXT,
        conditions JSON,
        options JSON,
        required BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        step_id UUID REFERENCES form_steps(id)
      )
    `)
  }

  static async down (): Promise<void> {
    await Database.query('DROP TABLE form_fields')
  }
}

export default CreateFormFieldsTable
