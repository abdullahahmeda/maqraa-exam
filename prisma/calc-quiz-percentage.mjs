import { PrismaClient } from '@prisma/client'
const _prisma = new PrismaClient()

async function main() {
  return await _prisma.$queryRaw`UPDATE "Quiz" SET "percentage" = ((grade + 0.0) / total) * 100  WHERE "correctedAt" IS NOT NULL`
}
main()
  .then(async (data) => {
    console.log(data)
    await _prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await _prisma.$disconnect()
    process.exit(1)
  })
