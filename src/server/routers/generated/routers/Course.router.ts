/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CourseSchema } from '../schemas/Course.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(CourseSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.create(input))),

        delete: procedure
            .input(CourseSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.delete(input))),

        findFirst: procedure
            .input(CourseSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findFirst(input))),

        findMany: procedure
            .input(CourseSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findMany(input))),

        update: procedure
            .input(CourseSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.update(input))),
    });
}
