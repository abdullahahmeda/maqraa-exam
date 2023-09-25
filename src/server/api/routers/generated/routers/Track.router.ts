/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, type ProcReturns, type PrismaClient, db } from '.';
import $Schema from '@zenstackhq/runtime/zod/input';
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

export default function createRouter<Router extends RouterFactory<BaseConfig>, Proc extends ProcBuilder<BaseConfig>>(
    router: Router,
    procedure: Proc,
) {
    return router({
        delete: procedure
            .input($Schema.TrackInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).track.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.TrackInputSchema)['delete'],
            ReturnType<PrismaClient['track']['delete']>
        >,

        findFirst: procedure
            .input($Schema.TrackInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.TrackInputSchema)['findFirst'],
            ReturnType<PrismaClient['track']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.TrackInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.TrackInputSchema)['findFirst'],
            ReturnType<PrismaClient['track']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.TrackInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).track.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.TrackInputSchema)['findMany'],
            ReturnType<PrismaClient['track']['findMany']>
        >,

        count: procedure
            .input($Schema.TrackInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).track.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.TrackInputSchema)['count'],
            ReturnType<PrismaClient['track']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
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
    count: {
        useQuery: <T extends Prisma.TrackCountArgs>(
            input: Prisma.Subset<T, Prisma.TrackCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.TrackCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.TrackCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TrackCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TrackCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.TrackCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.TrackCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TrackCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
