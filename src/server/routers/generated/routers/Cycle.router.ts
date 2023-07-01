/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CycleSchema } from '../schemas/Cycle.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(CycleSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.create(input))),

        delete: procedure
            .input(CycleSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.delete(input))),

        findFirst: procedure
            .input(CycleSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirst(input))),

        findMany: procedure
            .input(CycleSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findMany(input))),

        update: procedure
            .input(CycleSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.update(input))),
    });
}
