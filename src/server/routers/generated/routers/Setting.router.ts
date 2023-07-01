/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { SettingSchema } from '../schemas/Setting.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(SettingSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.create(input))),

        delete: procedure
            .input(SettingSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.delete(input))),

        findFirst: procedure
            .input(SettingSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirst(input))),

        findMany: procedure
            .input(SettingSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findMany(input))),

        update: procedure
            .input(SettingSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.update(input))),
    });
}
