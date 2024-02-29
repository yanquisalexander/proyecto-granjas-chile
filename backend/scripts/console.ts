import User from '@/app/models/User.model'
import Database from '@/lib/DatabaseManager'
import repl from 'repl'

Database.connect().then(() => {
  console.log('Database connected')
  const r = repl.start('> ')
  r.context.Database = Database
  r.context.User = User
  r.context.exit = () => {
    Database.close()
    process.exit()
  }
}).catch((error) => {
  console.error('Error connecting to the database:', error)
  process.exit(1)
})
