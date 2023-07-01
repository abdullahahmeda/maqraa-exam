/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { TrackSchema } from '../schemas/Track.schema';
import { checkRead, checkMutate } from '../helper';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(TrackSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.create(input))),

        delete: procedure
            .input(TrackSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.delete(input))),

        findFirst: procedure
            .input(TrackSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findFirst(input))),

        findMany: procedure
            .input(TrackSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findMany(input))),

        update: procedure
            .input(TrackSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.update(input))),
    });
}
