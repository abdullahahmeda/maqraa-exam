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
            .input($Schema.ErrorReportInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).errorReport.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.ErrorReportInputSchema)['delete'],
            ReturnType<PrismaClient['errorReport']['delete']>
        >,

        findFirst: procedure
            .input($Schema.ErrorReportInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).errorReport.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ErrorReportInputSchema)['findFirst'],
            ReturnType<PrismaClient['errorReport']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.ErrorReportInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).errorReport.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ErrorReportInputSchema)['findFirst'],
            ReturnType<PrismaClient['errorReport']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.ErrorReportInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).errorReport.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ErrorReportInputSchema)['findMany'],
            ReturnType<PrismaClient['errorReport']['findMany']>
        >,

        count: procedure
            .input($Schema.ErrorReportInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).errorReport.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.ErrorReportInputSchema)['count'],
            ReturnType<PrismaClient['errorReport']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.ErrorReportDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.ErrorReportDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.ErrorReportGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.ErrorReportGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.ErrorReportDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.ErrorReportDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.ErrorReportGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.ErrorReportGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.ErrorReportFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.ErrorReportFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.ErrorReportGetPayload<T>,
                Prisma.ErrorReportGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.ErrorReportGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ErrorReportFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ErrorReportFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ErrorReportGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ErrorReportGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.ErrorReportFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.ErrorReportFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.ErrorReportGetPayload<T>,
                Prisma.ErrorReportGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.ErrorReportGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ErrorReportFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ErrorReportFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ErrorReportGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ErrorReportGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.ErrorReportFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.ErrorReportFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.ErrorReportGetPayload<T>>,
                Array<Prisma.ErrorReportGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.ErrorReportGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ErrorReportFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ErrorReportFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.ErrorReportGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.ErrorReportGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.ErrorReportCountArgs>(
            input: Prisma.Subset<T, Prisma.ErrorReportCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ErrorReportCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ErrorReportCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ErrorReportCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.ErrorReportCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.ErrorReportCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.ErrorReportCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.ErrorReportCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
