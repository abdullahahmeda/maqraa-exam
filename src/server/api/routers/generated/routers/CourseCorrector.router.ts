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
            .input($Schema.CourseCorrectorInputSchema.delete)
            .mutation(async ({ ctx, input }) =>
                checkMutate(db(ctx).courseCorrector.delete(input as any)),
            ) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.CourseCorrectorInputSchema)['delete'],
            ReturnType<PrismaClient['courseCorrector']['delete']>
        >,

        findFirst: procedure
            .input($Schema.CourseCorrectorInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).courseCorrector.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseCorrectorInputSchema)['findFirst'],
            ReturnType<PrismaClient['courseCorrector']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.CourseCorrectorInputSchema.findFirst)
            .query(({ ctx, input }) =>
                checkRead(db(ctx).courseCorrector.findFirstOrThrow(input as any)),
            ) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseCorrectorInputSchema)['findFirst'],
            ReturnType<PrismaClient['courseCorrector']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.CourseCorrectorInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).courseCorrector.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseCorrectorInputSchema)['findMany'],
            ReturnType<PrismaClient['courseCorrector']['findMany']>
        >,

        count: procedure
            .input($Schema.CourseCorrectorInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).courseCorrector.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseCorrectorInputSchema)['count'],
            ReturnType<PrismaClient['courseCorrector']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.CourseCorrectorDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CourseCorrectorDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CourseCorrectorGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CourseCorrectorGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CourseCorrectorDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CourseCorrectorDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CourseCorrectorGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CourseCorrectorGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CourseCorrectorFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseCorrectorFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CourseCorrectorGetPayload<T>,
                Prisma.CourseCorrectorGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CourseCorrectorGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseCorrectorFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseCorrectorFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CourseCorrectorGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CourseCorrectorGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CourseCorrectorFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseCorrectorFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CourseCorrectorGetPayload<T>,
                Prisma.CourseCorrectorGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CourseCorrectorGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseCorrectorFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseCorrectorFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CourseCorrectorGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CourseCorrectorGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CourseCorrectorFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseCorrectorFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CourseCorrectorGetPayload<T>>,
                Array<Prisma.CourseCorrectorGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CourseCorrectorGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseCorrectorFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseCorrectorFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CourseCorrectorGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CourseCorrectorGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.CourseCorrectorCountArgs>(
            input: Prisma.Subset<T, Prisma.CourseCorrectorCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCorrectorCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCorrectorCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CourseCorrectorCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CourseCorrectorCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.CourseCorrectorCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCorrectorCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CourseCorrectorCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
