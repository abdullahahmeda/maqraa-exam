import { TRPCError } from '@trpc/server'
import { getSettings, updateSettings } from '../../../services/settings'
import { logErrorToLogtail } from '../../../utils/logtail'
import { updateSettingsSchema } from '../../../validation/updateSettingsSchema'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const settingsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getSettings()
  }),

  update: publicProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input }) => {
      try {
        updateSettings(input)
      } catch (error: any) {
        logErrorToLogtail(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'حدث خطأ غير متوقع'
        })
      }
      return true
    })
})
