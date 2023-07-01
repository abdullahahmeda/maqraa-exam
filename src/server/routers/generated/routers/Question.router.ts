/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { QuestionSchema } from '../schemas/Question.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(QuestionSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.create(input))),

        delete: procedure
            .input(QuestionSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.delete(input))),

        findFirst: procedure
            .input(QuestionSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findFirst(input))),

        findMany: procedure
            .input(QuestionSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findMany(input))),

        update: procedure
            .input(QuestionSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.update(input))),
    });
}
