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
            .input($Schema.SettingInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.SettingInputSchema)['delete'],
            ReturnType<PrismaClient['setting']['delete']>
        >,

        findFirst: procedure
            .input($Schema.SettingInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SettingInputSchema)['findFirst'],
            ReturnType<PrismaClient['setting']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.SettingInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SettingInputSchema)['findFirst'],
            ReturnType<PrismaClient['setting']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.SettingInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SettingInputSchema)['findMany'],
            ReturnType<PrismaClient['setting']['findMany']>
        >,

        count: procedure
            .input($Schema.SettingInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.SettingInputSchema)['count'],
            ReturnType<PrismaClient['setting']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.SettingDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.SettingDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SettingGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.SettingGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.SettingDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.SettingDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SettingGetPayload<T>, Context>,
            ) => Promise<Prisma.SettingGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.SettingFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.SettingFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.SettingGetPayload<T>, Prisma.SettingGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.SettingGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SettingFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SettingFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SettingGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SettingGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.SettingFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.SettingFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.SettingGetPayload<T>, Prisma.SettingGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.SettingGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SettingFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SettingFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SettingGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.SettingGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.SettingFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.SettingFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.SettingGetPayload<T>>,
                Array<Prisma.SettingGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.SettingGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.SettingFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SettingFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.SettingGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.SettingGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.SettingCountArgs>(
            input: Prisma.Subset<T, Prisma.SettingCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SettingCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SettingCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SettingCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SettingCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.SettingCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.SettingCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SettingCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
