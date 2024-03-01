import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateFormsTable extends Migration {
  static async up (): Promise<void> {
    await Database.query(`
      CREATE TABLE forms (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        form_status VARCHAR(255) NOT NULL,
        custom_css TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        work_group_id UUID REFERENCES work_groups(id)
      )
    `)
  }

  static async down (): Promise<void> {
    await Database.query('DROP TABLE forms')
  }
}

export default CreateFormsTable
