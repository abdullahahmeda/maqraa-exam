/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { ExamSchema } from '../schemas/Exam.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(ExamSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.create(input))),

        delete: procedure
            .input(ExamSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.delete(input))),

        findFirst: procedure
            .input(ExamSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirst(input))),

        findMany: procedure
            .input(ExamSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findMany(input))),

        update: procedure
            .input(ExamSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.update(input))),
    });
}
