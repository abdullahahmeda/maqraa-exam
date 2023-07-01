/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { UserSchema } from '../schemas/User.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(UserSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).user.create(input))),

        delete: procedure
            .input(UserSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).user.delete(input))),

        findFirst: procedure
            .input(UserSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).user.findFirst(input))),

        findMany: procedure
            .input(UserSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).user.findMany(input))),

        update: procedure
            .input(UserSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).user.update(input))),
    });
}
