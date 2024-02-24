import Database from './lib/DatabaseManager'

const bootApplication = async (): Promise<void> => {
  await Database.connect()
  console.log('Application booted')
}

bootApplication()
