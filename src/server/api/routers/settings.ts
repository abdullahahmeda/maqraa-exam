// import { TRPCError } from '@trpc/server'
// import { getSettings, updateSettings } from '~/services/settings'
// import { logErrorToLogtail } from '~/utils/logtail'
// import { updateSettingsSchema } from '~/validation/updateSettingsSchema'
// import { adminOnlyProcedure, createTRPCRouter, publicProcedure } from '../trpc'

import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { SettingSchema } from './schemas/Setting.schema'
import { checkMutate, db, checkRead } from './helper'

// export const settingsRouter = createTRPCRouter({
//   fetchAll: adminOnlyProcedure.query(async () => {
//     return await getSettings()
//   }),

//   update: adminOnlyProcedure
//     .input(updateSettingsSchema)
//     .mutation(async ({ input }) => {
//       try {
//         updateSettings(input)
//       } catch (error: any) {
//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: 'حدث خطأ غير متوقع',
//         })
//       }
//       return true
//     }),
// })

export const settingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(SettingSchema.create)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).setting.create(input))
    ),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).setting.delete({ where: { key: input } }))
    ),

  findFirst: protectedProcedure
    .input(SettingSchema.findFirst)
    .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirst(input))),

  findMany: protectedProcedure
    .input(SettingSchema.findMany)
    .query(({ ctx, input }) => checkRead(db(ctx).setting.findMany(input))),

  update: protectedProcedure
    .input(SettingSchema.update)
    .mutation(async ({ ctx, input }) =>
      checkMutate(db(ctx).setting.update(input))
    ),
})
