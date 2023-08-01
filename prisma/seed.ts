import { PrismaClient } from '@prisma/client'
import { SettingKey, UserRole } from '../src/constants'
import { generate as generatePassword } from 'generate-password'
const prisma = new PrismaClient()

const adminEmail = 'abdullah.ahmed.a2000@gmail.com'

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

  const password = generatePassword()

  await prisma.user.create({
    data: {
      email: adminEmail,
      password,
      corrector: {},
      role: UserRole.ADMIN,
      name: 'الأدمن'
    }
  })
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
