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
            .input($Schema.SystemExamInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).systemExam.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.SystemExamInputSchema)['delete'],
            ReturnType<PrismaClient['systemExam']['delete']>
        >,

        findFirst: procedure
            .input($Schema.SystemExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExam.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamInputSchema)['findFirst'],
            ReturnType<PrismaClient['systemExam']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.SystemExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExam.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamInputSchema)['findFirst'],
            ReturnType<PrismaClient['systemExam']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.SystemExamInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExam.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamInputSchema)['findMany'],
            ReturnType<PrismaClient['systemExam']['findMany']>
        >,

        count: procedure
            .input($Schema.SystemExamInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExam.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamInputSchema)['count'],
            ReturnType<PrismaClient['systemExam']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.SystemExamDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.SystemExamDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SystemExamGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.SystemExamGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.SystemExamDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.SystemExamDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.SystemExamGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.SystemExamGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.SystemExamFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.SystemExamGetPayload<T>,
                Prisma.SystemExamGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.SystemExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SystemExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SystemExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.SystemExamFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.SystemExamGetPayload<T>,
                Prisma.SystemExamGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.SystemExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SystemExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SystemExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.SystemExamFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.SystemExamGetPayload<T>>,
                Array<Prisma.SystemExamGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.SystemExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.SystemExamGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.SystemExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.SystemExamCountArgs>(
            input: Prisma.Subset<T, Prisma.SystemExamCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SystemExamCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SystemExamCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.SystemExamCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SystemExamCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
