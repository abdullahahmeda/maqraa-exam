import { z } from 'zod'
import { registerSchema } from '../validation/registerSchema'
import { prisma } from '../server/db'
import { UserRole } from '../constants'
import { PageOptions } from '../types'
import { updateUserSchema } from '~/validation/updateUserSchema'

export const getPaginatedUsers = async ({ page, pageSize }: PageOptions) => {
  return {
    users: await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    count: await prisma.user.count()
  }
}
export const getUser = async (id: string) => {
  return prisma.user.findUnique({ where: { id } })
}

export const updateUser = (data: z.infer<typeof updateUserSchema>) => {
  const { id, ...newData } = data
  return prisma.user.update({
    where: {
      id
    },
    data: newData
  })
}

export const registerStudent = (data: z.infer<typeof registerSchema>) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: UserRole.STUDENT
    }
  })
}
