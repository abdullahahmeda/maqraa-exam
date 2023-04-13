import { z } from 'zod'
import { registerSchema } from '../validation/registerSchema'
import { prisma } from '../server/db'
import { UserRole } from '../constants'
import { PageOptions } from '../types'

export const getPaginatedUsers = async ({ page, pageSize }: PageOptions) => {
  return {
    users: await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    count: await prisma.user.count()
  }
}

export const registerStudent = (data: z.infer<typeof registerSchema>) => {
  return prisma.user.create({
    data: {
      id: data.email,
      name: data.name,
      email: data.email,
      role: UserRole.STUDENT
    }
  })
}
