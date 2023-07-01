/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CurriculumSchema } from '../schemas/Curriculum.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(CurriculumSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.create(input))),

        delete: procedure
            .input(CurriculumSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.delete(input))),

        findFirst: procedure
            .input(CurriculumSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirst(input))),

        findMany: procedure
            .input(CurriculumSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findMany(input))),

        update: procedure
            .input(CurriculumSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.update(input))),
    });
}
