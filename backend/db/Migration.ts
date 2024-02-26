abstract class Migration {
  static async up (): Promise<void> {
    throw new Error('up method must be implemented in the migration')
  }

  static async down (): Promise<void> {
    throw new Error('down method must be implemented in the migration')
  }

  static async run (): Promise<void> {
    try {
      await this.up()
    } catch (error) {
      console.error('Error running migration:', error)
      await this.down()
    }
  }
}

export default Migration
