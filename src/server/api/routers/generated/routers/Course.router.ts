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
            .input($Schema.CourseInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.delete(input as any))) as ProcReturns<
            'mutation',
            Proc,
            (typeof $Schema.CourseInputSchema)['delete'],
            ReturnType<PrismaClient['course']['delete']>
        >,

        findFirst: procedure
            .input($Schema.CourseInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findFirst(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseInputSchema)['findFirst'],
            ReturnType<PrismaClient['course']['findFirst']>
        >,

        findFirstOrThrow: procedure
            .input($Schema.CourseInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findFirstOrThrow(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseInputSchema)['findFirst'],
            ReturnType<PrismaClient['course']['findFirstOrThrow']>
        >,

        findMany: procedure
            .input($Schema.CourseInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findMany(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseInputSchema)['findMany'],
            ReturnType<PrismaClient['course']['findMany']>
        >,

        count: procedure
            .input($Schema.CourseInputSchema.count)
            .query(({ ctx, input }) => checkRead(db(ctx).course.count(input as any))) as ProcReturns<
            'query',
            Proc,
            (typeof $Schema.CourseInputSchema)['count'],
            ReturnType<PrismaClient['course']['count']>
        >,
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    delete: {
        useMutation: <T extends Prisma.CourseDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CourseDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CourseGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CourseGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CourseDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CourseDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CourseGetPayload<T>, Context>,
            ) => Promise<Prisma.CourseGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CourseFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CourseGetPayload<T>, Prisma.CourseGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CourseGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CourseGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CourseGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CourseFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CourseGetPayload<T>, Prisma.CourseGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CourseGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CourseGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CourseGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CourseFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CourseFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CourseGetPayload<T>>,
                Array<Prisma.CourseGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CourseGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CourseFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CourseFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CourseGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CourseGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    count: {
        useQuery: <T extends Prisma.CourseCountArgs>(
            input: Prisma.Subset<T, Prisma.CourseCountArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCountAggregateOutputType>
                    : number,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CourseCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CourseCountArgs>(
            input: Omit<Prisma.Subset<T, Prisma.CourseCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
                string,
                T,
                'select' extends keyof T
                    ? T['select'] extends true
                        ? number
                        : Prisma.GetScalarType<T['select'], Prisma.CourseCountAggregateOutputType>
                    : number,
                Error
            >,
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
                ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.CourseCountAggregateOutputType>
                : number,
            TRPCClientErrorLike<AppRouter>
        >;
    };
}
