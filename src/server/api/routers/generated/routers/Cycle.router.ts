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
            .input($Schema.CycleInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.CycleInputSchema)['delete'],
            ReturnType<PrismaClient['cycle']['delete']>
        >,

        findFirst: procedure
            .input($Schema.CycleInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CycleInputSchema)['findFirst'],
            ReturnType<PrismaClient['cycle']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.CycleInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CycleInputSchema)['findFirst'],
            ReturnType<PrismaClient['cycle']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.CycleInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CycleInputSchema)['findMany'],
            ReturnType<PrismaClient['cycle']['findMany']>
        >,

        count: procedure
            .input($Schema.CycleInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CycleInputSchema)['count'],
            ReturnType<PrismaClient['cycle']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.CycleDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CycleDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CycleGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CycleGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CycleDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CycleDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CycleGetPayload<T>, Context>,
            ) => Promise<Prisma.CycleGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CycleFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CycleGetPayload<T>, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CycleFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CycleGetPayload<T>, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CycleFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CycleGetPayload<T>>,
                Array<Prisma.CycleGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CycleGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CycleGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CycleGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.CycleCountArgs>(
            input: Prisma.Subset<T, Prisma.CycleCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CycleCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CycleCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CycleCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CycleCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.CycleCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CycleCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CycleCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
