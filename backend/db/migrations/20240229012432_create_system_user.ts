import Migration from '@/db/Migration'
import Database from '@/lib/DatabaseManager'

class CreateSystemUser extends Migration {
  static async up (): Promise<void> {
    const password = crypto.randomUUID().replace(/-/g, '')
    await Database.query(`
      INSERT INTO users (username, email, password)
      VALUES ('system', 'system@localhost', $1)
    `, [password], true)

    /*
      Log of this query will be ignored, likewise the password will not be
      valid according to the encryption method used in the application.
    */
  }

  static async down (): Promise<void> {
    await Database.query('DELETE FROM users WHERE email = $1', ['system@localhost'])
  }
}

export default CreateSystemUser
