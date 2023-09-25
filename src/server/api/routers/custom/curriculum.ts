import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc'
import { checkMutate, checkRead, db } from './helper'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'

export const curriculumRouter = createTRPCRouter({
  createCurriculum: protectedProcedure
    .input(newCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { parts, ...data } = input
      return checkMutate(
        db(ctx).curriculum.create({
          data: {
            ...data,
            parts: { create: parts },
          },
        })
      )
    }),

  updateCurriculum: protectedProcedure
    .input(editCurriculumSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, parts, ...data } = input
      return checkMutate(
        db(ctx).curriculum.update({
          where: { id },
          data: {
            ...data,
            parts: { deleteMany: {}, create: parts },
          },
        })
      )
    }),
})
