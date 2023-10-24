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
            .input($Schema.QuizInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).quiz.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.QuizInputSchema)['delete'],
            ReturnType<PrismaClient['quiz']['delete']>
        >,

        findFirst: procedure
            .input($Schema.QuizInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).quiz.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuizInputSchema)['findFirst'],
            ReturnType<PrismaClient['quiz']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.QuizInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).quiz.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuizInputSchema)['findFirst'],
            ReturnType<PrismaClient['quiz']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.QuizInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).quiz.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuizInputSchema)['findMany'],
            ReturnType<PrismaClient['quiz']['findMany']>
        >,

        count: procedure
            .input($Schema.QuizInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).quiz.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuizInputSchema)['count'],
            ReturnType<PrismaClient['quiz']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.QuizDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.QuizDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.QuizGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.QuizGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.QuizDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.QuizDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.QuizGetPayload<T>, Context>,
            ) => Promise<Prisma.QuizGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.QuizFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuizFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.QuizGetPayload<T>, Prisma.QuizGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.QuizGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuizFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuizFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.QuizGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.QuizGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.QuizFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuizFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.QuizGetPayload<T>, Prisma.QuizGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.QuizGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuizFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuizFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.QuizGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.QuizGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.QuizFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuizFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.QuizGetPayload<T>>,
                Array<Prisma.QuizGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.QuizGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuizFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuizFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.QuizGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.QuizGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.QuizCountArgs>(
            input: Prisma.Subset<T, Prisma.QuizCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuizCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuizCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.QuizCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.QuizCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.QuizCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuizCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.QuizCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
