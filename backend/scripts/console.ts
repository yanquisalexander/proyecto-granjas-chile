import Form from '@/app/models/Form.model'
import FormField from '@/app/models/FormField.model'
import FormStep from '@/app/models/FormStep.model'
import User from '@/app/models/User.model'
import Database from '@/lib/DatabaseManager'
import repl from 'repl'

Database.connect()
const r = repl.start('> ')
r.context.Database = Database
r.context.User = User
r.context.Form = Form
r.context.FormField = FormField
r.context.FormStep = FormStep
r.context.exit = () => {
  Database.close()
  process.exit()
}