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
            .input($Schema.SystemExamQuestionInputSchema.delete)
            .mutation(async ({ ctx, input }) =>
                checkMutate(db(ctx).systemExamQuestion.delete(input as any)),
            ) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.SystemExamQuestionInputSchema)['delete'],
            ReturnType<PrismaClient['systemExamQuestion']['delete']>
        >,

        findFirst: procedure
            .input($Schema.SystemExamQuestionInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExamQuestion.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamQuestionInputSchema)['findFirst'],
            ReturnType<PrismaClient['systemExamQuestion']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.SystemExamQuestionInputSchema.findFirst)
            .query(({ ctx, input }) =>
                checkRead(db(ctx).systemExamQuestion.findFirstOrThrow(input as any)),
            ) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamQuestionInputSchema)['findFirst'],
            ReturnType<PrismaClient['systemExamQuestion']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.SystemExamQuestionInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExamQuestion.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamQuestionInputSchema)['findMany'],
            ReturnType<PrismaClient['systemExamQuestion']['findMany']>
        >,

        count: procedure
            .input($Schema.SystemExamQuestionInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).systemExamQuestion.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SystemExamQuestionInputSchema)['count'],
            ReturnType<PrismaClient['systemExamQuestion']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.SystemExamQuestionDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.SystemExamQuestionDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SystemExamQuestionGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.SystemExamQuestionGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.SystemExamQuestionDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.SystemExamQuestionDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.SystemExamQuestionGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.SystemExamQuestionGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.SystemExamQuestionFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.SystemExamQuestionGetPayload<T>,
                Prisma.SystemExamQuestionGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.SystemExamQuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamQuestionFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SystemExamQuestionGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SystemExamQuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.SystemExamQuestionFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.SystemExamQuestionGetPayload<T>,
                Prisma.SystemExamQuestionGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.SystemExamQuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamQuestionFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SystemExamQuestionGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SystemExamQuestionGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.SystemExamQuestionFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.SystemExamQuestionGetPayload<T>>,
                Array<Prisma.SystemExamQuestionGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.SystemExamQuestionGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SystemExamQuestionFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SystemExamQuestionFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.SystemExamQuestionGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.SystemExamQuestionGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.SystemExamQuestionCountArgs>(
            input: Prisma.Subset<T, Prisma.SystemExamQuestionCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamQuestionCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamQuestionCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SystemExamQuestionCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SystemExamQuestionCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.SystemExamQuestionCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SystemExamQuestionCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SystemExamQuestionCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
