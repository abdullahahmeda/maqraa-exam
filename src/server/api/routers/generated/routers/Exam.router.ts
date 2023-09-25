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
            .input($Schema.ExamInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.ExamInputSchema)['delete'],
            ReturnType<PrismaClient['exam']['delete']>
        >,

        findFirst: procedure
            .input($Schema.ExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ExamInputSchema)['findFirst'],
            ReturnType<PrismaClient['exam']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.ExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ExamInputSchema)['findFirst'],
            ReturnType<PrismaClient['exam']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.ExamInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ExamInputSchema)['findMany'],
            ReturnType<PrismaClient['exam']['findMany']>
        >,

        count: procedure
            .input($Schema.ExamInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ExamInputSchema)['count'],
            ReturnType<PrismaClient['exam']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.ExamDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.ExamDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.ExamGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.ExamGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.ExamDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.ExamDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExamGetPayload<T>, Context>,
            ) => Promise<Prisma.ExamGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.ExamFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExamGetPayload<T>, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.ExamFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExamGetPayload<T>, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.ExamFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.ExamGetPayload<T>>,
                Array<Prisma.ExamGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.ExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.ExamGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.ExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.ExamCountArgs>(
            input: Prisma.Subset<T, Prisma.ExamCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ExamCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ExamCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ExamCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ExamCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.ExamCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ExamCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ExamCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
