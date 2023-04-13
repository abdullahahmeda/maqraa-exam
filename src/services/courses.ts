import { z } from 'zod'
import { prisma } from '../server/db'
import { PageOptions } from '../types'
import { newCourseSchema } from '../validation/newCourseSchema'

export const getPaginatedCourses = async ({ page, pageSize }: PageOptions) => {
  return {
    courses: await prisma.course.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        questions: {
          select: {
            id: true
          }
        }
      }
    }),
    count: await prisma.course.count()
  }
}

export const fetchAllCourses = () => {
  return prisma.course.findMany()
}

export const createCourse = (data: z.infer<typeof newCourseSchema>) => {
  return prisma.course.create({
    data
  })
}

export const deleteCourse = (id: number) =>
  prisma.course.delete({ where: { id } })
