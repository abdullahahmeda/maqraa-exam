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
            .input($Schema.CurriculumPartInputSchema.delete)
            .mutation(async ({ ctx, input }) =>
                checkMutate(db(ctx).curriculumPart.delete(input as any)),
            ) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.CurriculumPartInputSchema)['delete'],
            ReturnType<PrismaClient['curriculumPart']['delete']>
        >,

        findFirst: procedure
            .input($Schema.CurriculumPartInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculumPart.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumPartInputSchema)['findFirst'],
            ReturnType<PrismaClient['curriculumPart']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.CurriculumPartInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculumPart.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumPartInputSchema)['findFirst'],
            ReturnType<PrismaClient['curriculumPart']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.CurriculumPartInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculumPart.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumPartInputSchema)['findMany'],
            ReturnType<PrismaClient['curriculumPart']['findMany']>
        >,

        count: procedure
            .input($Schema.CurriculumPartInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculumPart.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CurriculumPartInputSchema)['count'],
            ReturnType<PrismaClient['curriculumPart']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.CurriculumPartDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CurriculumPartDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CurriculumPartGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CurriculumPartGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CurriculumPartDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CurriculumPartDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CurriculumPartGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CurriculumPartGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CurriculumPartFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumPartFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumPartGetPayload<T>,
                Prisma.CurriculumPartGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumPartGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumPartFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumPartFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumPartGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumPartGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CurriculumPartFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumPartFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumPartGetPayload<T>,
                Prisma.CurriculumPartGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumPartGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumPartFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumPartFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumPartGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumPartGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CurriculumPartFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumPartFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CurriculumPartGetPayload<T>>,
                Array<Prisma.CurriculumPartGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CurriculumPartGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumPartFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumPartFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CurriculumPartGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CurriculumPartGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.CurriculumPartCountArgs>(
            input: Prisma.Subset<T, Prisma.CurriculumPartCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumPartCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumPartCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CurriculumPartCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CurriculumPartCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.CurriculumPartCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CurriculumPartCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CurriculumPartCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
