import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { updateSettingsSchema } from '~/validation/updateSettingsSchema'
import { SettingKey, UserRole } from '~/kysely/enums'

export const settingRouter = createTRPCRouter({
  getSiteName: protectedProcedure.query(async ({ ctx }) => {
    const row = await ctx.db
      .selectFrom('Setting')
      .selectAll()
      .where('key', '=', SettingKey.SITE_NAME)
      .executeTakeFirst()
    return row?.value
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
      const { menuItems, ...settings } = input
      await ctx.db.transaction().execute(async (trx) => {
        await trx.deleteFrom('MenuItem').execute()
        for (const [role, menu] of Object.entries(menuItems)) {
          await trx
            .insertInto('MenuItem')
            .values(
              menu.map((item, index) => ({
                key: item.key,
                label: item.label,
                icon: item.icon,
                order: index + 1,
                role: role as UserRole,
              }))
            )
            .execute()
        }
        for (const [settingKey, value] of Object.entries(settings)) {
          await trx
            .updateTable('Setting')
            .set({ value })
            .where('key', '=', settingKey as keyof typeof SettingKey)
            .execute()
        }
      })
    }),
})
