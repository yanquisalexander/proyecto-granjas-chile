import 'dotenv/config'

export const Configuration = {
  DATABASE_NAME: process.env.DB_NAME || 'postgres',
  DATABASE_HOST: process.env.DB_HOST || 'localhost',
  DATABASE_PORT: parseInt(process.env.DB_PORT || '5432'),
  DATABASE_USER: process.env.DB_USER || 'postgres',
  DATABASE_PASS: process.env.DB_PASS || 'postgres'

}
