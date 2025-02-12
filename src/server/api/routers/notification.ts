import { createNotificationSchema } from '~/validation/backend/mutations/notification/create'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { type Expression, type SqlBool, sql } from 'kysely'
import { markNotificationAsReadSchema } from '~/validation/backend/mutations/notification/mark-as-read'

export const notificationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createNotificationSchema)
    .mutation(async ({ input, ctx }) => {
      const { to, ...data } = input
      await ctx.db.transaction().execute(async (trx) => {
        const { id: notificationId }: { id: string } = await trx
          .insertInto('Notification')
          .values(data)
          .returning('id')
          .executeTakeFirstOrThrow()

        if (to.base === 'all') {
          await trx
            .insertInto('UserNotification')
            .columns(['notificationId', 'userId'])
            .expression((eb) =>
              eb
                .selectFrom('User')
                .select([
                  sql.lit(notificationId).as('notificationId'),
                  'User.id',
                ]),
            )
            .execute()
        } else if (to.base === 'allExcept') {
          await trx
            .insertInto('UserNotification')
            .columns(['notificationId', 'userId'])
            .expression((eb) =>
              eb
                .selectFrom('User')
                .select([
                  sql.lit(notificationId).as('notificationId'),
                  'User.id',
                ])
                .where(
                  'id',
                  'not in',
                  to.allExcept.map(({ value }) => value),
                ),
            )
            .execute()
        } else if (to.base === 'selected') {
          await trx
            .insertInto('UserNotification')
            .values(
              to.selected.map(({ value: userId }) => ({
                notificationId,
                userId,
              })),
            )
            .execute()
        } else if (to.base === 'custom') {
          await trx
            .insertInto('UserNotification')
            .columns(['notificationId', 'userId'])
            .expression((eb) =>
              eb
                .selectFrom('User')
                .select([
                  sql.lit(notificationId).as('notificationId'),
                  'User.id',
                ])
                .where((eb) => {
                  const where: Expression<SqlBool>[] = [
                    eb('User.role', 'in', to.custom.role),
                  ]

                  if (to.custom.cycle !== 'all') {
                    where.push(
                      eb.or([
                        eb('User.role', 'in', ['ADMIN', 'SUPER_ADMIN']),
                        eb.exists(
                          eb
                            .selectFrom('UserCycle')
                            .where('UserCycle.cycleId', '=', to.custom.cycle)
                            .whereRef('UserCycle.userId', '=', 'User.id'),
                        ),
                      ]),
                    )
                  }

                  return eb.and(where)
                }),
            )
            .execute()
        }
      })
    }),

  fetch: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .selectFrom('UserNotification')
      .innerJoin(
        'Notification',
        'UserNotification.notificationId',
        'Notification.id',
      )
      .select([
        'UserNotification.id',
        'Notification.body',
        'Notification.url',
        'UserNotification.isRead',
        'UserNotification.createdAt',
      ])
      .where('UserNotification.userId', '=', ctx.session.user.id)
      .orderBy('UserNotification.createdAt desc')
      .execute()

    return results
  }),

  markAsRead: protectedProcedure
    .input(markNotificationAsReadSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable('UserNotification')
        .set({ isRead: true })
        .where('UserNotification.id', '=', input.id)
        .execute()
      return true
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .updateTable('UserNotification')
      .set({ isRead: true })
      .where('UserNotification.userId', '=', ctx.session.user.id)
      .execute()
    return true
  }),
})
