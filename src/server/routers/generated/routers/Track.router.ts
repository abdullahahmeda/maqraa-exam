/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { TrackInputSchema } from '@zenstackhq/runtime/zod/input';
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@prisma/client';
import type {
    UseTRPCMutationOptions,
    UseTRPCMutationResult,
    UseTRPCQueryOptions,
    UseTRPCQueryResult,
    UseTRPCInfiniteQueryOptions,
    UseTRPCInfiniteQueryResult,
} from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(TrackInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.create(input as any))),

        delete: procedure
            .input(TrackInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.delete(input as any))),

        findFirst: procedure
            .input(TrackInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(TrackInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(TrackInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findMany(input as any))),

        update: procedure
            .input(TrackInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.TrackCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.TrackCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.TrackGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.TrackGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.TrackCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.TrackCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TrackGetPayload<T>, Context>,
            ) => Promise<Prisma.TrackGetPayload<T>>;
        };
    };
    delete: {
        useMutation: <T extends Prisma.TrackDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.TrackDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.TrackGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.TrackGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.TrackDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.TrackDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TrackGetPayload<T>, Context>,
            ) => Promise<Prisma.TrackGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.TrackFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.TrackFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TrackGetPayload<T>, Prisma.TrackGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.TrackGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.TrackFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TrackFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TrackGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.TrackGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.TrackFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.TrackFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TrackGetPayload<T>, Prisma.TrackGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.TrackGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.TrackFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TrackFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TrackGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.TrackGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.TrackFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.TrackFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.TrackGetPayload<T>>,
                Array<Prisma.TrackGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.TrackGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.TrackFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TrackFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.TrackGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.TrackGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    update: {
        useMutation: <T extends Prisma.TrackUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.TrackUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.TrackGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.TrackGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.TrackUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.TrackUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TrackGetPayload<T>, Context>,
            ) => Promise<Prisma.TrackGetPayload<T>>;
        };
    };
}
