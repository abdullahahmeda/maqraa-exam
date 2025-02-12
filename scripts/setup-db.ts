import 'dotenv/config'
import { Kysely, PostgresDialect } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import { DB } from '../src/kysely/types'
import { SettingKey, UserRole } from '../src/kysely/enums'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export const db =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: process.env.DATABASE_URL,
          }),
        }),
      })
    : new Kysely<DB>({
        dialect: new NeonDialect({
          connectionString: process.env.DATABASE_URL,
        }),
      })

const ADMIN_USER = {
  name: 'Admin',
  email: 'admin@admin.com',
  password: bcrypt.hashSync('1234', 12),
  role: UserRole.SUPER_ADMIN,
}

const DEFAULT_SETTINGS = {
  [SettingKey.SITE_NAME]: 'مقرأة الوحيين',
}

async function main() {
  try {
    await db.insertInto('User').values(ADMIN_USER).execute()
    console.log('Admin user has been created!')
  } catch (error) {
    if ((error as { code: string }).code === '23505')
      console.log('Admin user already exists')
    else throw error
  }
  try {
    await db
      .insertInto('Setting')
      .values(
        Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
          key: key as SettingKey,
          value,
        })),
      )
      .execute()
    console.log('Settings has been created!')
  } catch (error) {
    if ((error as { code: string }).code === '23505')
      console.log('Settings already exists')
    else throw error
  }
}

void main()
