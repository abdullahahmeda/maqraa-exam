import { db } from '~/server/db'

export async function getSiteName() {
  const row = await db
    .selectFrom('Setting')
    .selectAll()
    .where('key', '=', SettingKey.SITE_NAME)
    .executeTakeFirst()
  return row?.value
}
