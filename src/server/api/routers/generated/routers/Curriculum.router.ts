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
            .input($Schema.CurriculumInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.CurriculumInputSchema)['delete'],
            ReturnType<PrismaClient['curriculum']['delete']>
        >,

        findFirst: procedure
            .input($Schema.CurriculumInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumInputSchema)['findFirst'],
            ReturnType<PrismaClient['curriculum']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.CurriculumInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumInputSchema)['findFirst'],
            ReturnType<PrismaClient['curriculum']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.CurriculumInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumInputSchema)['findMany'],
            ReturnType<PrismaClient['curriculum']['findMany']>
        >,

        count: procedure
            .input($Schema.CurriculumInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumInputSchema)['count'],
            ReturnType<PrismaClient['curriculum']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.CurriculumDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CurriculumDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CurriculumGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CurriculumGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CurriculumDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CurriculumDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CurriculumGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CurriculumGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CurriculumFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumGetPayload<T>,
                Prisma.CurriculumGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CurriculumFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumGetPayload<T>,
                Prisma.CurriculumGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CurriculumFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CurriculumGetPayload<T>>,
                Array<Prisma.CurriculumGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CurriculumGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CurriculumGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CurriculumGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.CurriculumCountArgs>(
            input: Prisma.Subset<T, Prisma.CurriculumCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CurriculumCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CurriculumCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.CurriculumCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CurriculumCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
