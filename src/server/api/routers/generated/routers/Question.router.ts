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
            .input($Schema.QuestionInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.QuestionInputSchema)['delete'],
            ReturnType<PrismaClient['question']['delete']>
        >,

        findFirst: procedure
            .input($Schema.QuestionInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuestionInputSchema)['findFirst'],
            ReturnType<PrismaClient['question']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.QuestionInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuestionInputSchema)['findFirst'],
            ReturnType<PrismaClient['question']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.QuestionInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuestionInputSchema)['findMany'],
            ReturnType<PrismaClient['question']['findMany']>
        >,

        count: procedure
            .input($Schema.QuestionInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).question.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.QuestionInputSchema)['count'],
            ReturnType<PrismaClient['question']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.QuestionDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.QuestionDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.QuestionGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.QuestionGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.QuestionDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.QuestionDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.QuestionGetPayload<T>, Context>,
            ) => Promise<Prisma.QuestionGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.QuestionFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuestionFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.QuestionGetPayload<T>, Prisma.QuestionGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.QuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuestionFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuestionFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.QuestionGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.QuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.QuestionFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuestionFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.QuestionGetPayload<T>, Prisma.QuestionGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.QuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuestionFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuestionFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.QuestionGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.QuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.QuestionFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.QuestionFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.QuestionGetPayload<T>>,
                Array<Prisma.QuestionGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.QuestionGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.QuestionFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.QuestionFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.QuestionGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.QuestionGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.QuestionCountArgs>(
            input: Prisma.Subset<T, Prisma.QuestionCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuestionCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuestionCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.QuestionCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.QuestionCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.QuestionCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.QuestionCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.QuestionCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
