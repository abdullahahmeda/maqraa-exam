import { z } from 'zod'
import { FilterSchema } from '../server/api/routers/curricula'
import { prisma } from '../server/db'
import { PageOptions } from '../types'
import { newCurriculumSchema } from '../validation/newCurriculumSchema'

export const getPaginatedCurricula = async ({
  page,
  pageSize
}: PageOptions) => {
  return {
    curricula: await prisma.curriculum.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        course: {
          select: {
            name: true
          }
        }
      }
    }),
    count: await prisma.curriculum.count()
  }
}

export const fetchAllCurricula = ({ filters }: { filters: FilterSchema }) => {
  filters = filters!
  return prisma.curriculum.findMany({
    where: {
      courseId: filters.course
    }
  })
}

export const createCurriculum = (
  curriculum: z.infer<typeof newCurriculumSchema>
) => {
  const data = {
    ...curriculum,
    course: { connect: { id: curriculum.course } },
    fromPage: curriculum.pages.from,
    toPage: curriculum.pages.to,
    pages: undefined
  }
  return prisma.curriculum.create({
    data
  })
}
