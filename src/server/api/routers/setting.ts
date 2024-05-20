import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { updateSettingsSchema } from '~/validation/backend/mutations/setting/update'
import { SettingKey } from '~/kysely/enums'

export const settingRouter = createTRPCRouter({
  getSiteName: publicProcedure.query(async ({ ctx }) => {
    const row = await ctx.db
      .selectFrom('Setting')
      .select('value')
      .where('key', '=', SettingKey.SITE_NAME)
      .executeTakeFirst()
    return row?.value ?? 'مقرأة الوحيين'
  }),
  getMenuItems: protectedProcedure.query(async ({ ctx }) => {
    const menu = await ctx.db
      .selectFrom('MenuItem')
      .selectAll()
      .where('role', '=', ctx.session.user.role)
      .orderBy('order')
      .execute()
    return menu
  }),
  update: protectedProcedure
    .input(updateSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction().execute(async (trx) => {
        for (const [settingKey, value] of Object.entries(input)) {
          await trx
            .updateTable('Setting')
            .set({ value })
            .where('key', '=', settingKey as keyof typeof SettingKey)
            .execute()
        }
      })
    }),
})
