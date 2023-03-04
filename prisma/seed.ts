import { PrismaClient } from '@prisma/client'
import { SettingKey } from '../src/constants'
const prisma = new PrismaClient()

async function main () {
  for (const key of [
    SettingKey.EASY_MCQ_QUESTIONS,
    SettingKey.EASY_WRITTEN_QUESTIONS,
    SettingKey.MEDIUM_MCQ_QUESTIONS,
    SettingKey.MEDIUM_WRITTEN_QUESTIONS,
    SettingKey.HARD_MCQ_QUESTIONS,
    SettingKey.HARD_WRITTEN_QUESTIONS
  ]) {
    await prisma.setting.upsert({
      where: {
        key
      },
      update: {},
      create: {
        key,
        value: '10'
      }
    })
  }
  console.log('Seeding has finished successfully.')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
