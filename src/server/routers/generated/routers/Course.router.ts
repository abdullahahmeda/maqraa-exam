/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CourseInputSchema } from '@zenstackhq/runtime/zod/input';
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

export default function createRouter<Config extends BaseConfig>(
    router: RouterFactory<Config>,
    procedure: ProcBuilder<Config>,
) {
    return router({
        create: procedure
            .input(CourseInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.create(input as any))),

        delete: procedure
            .input(CourseInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.delete(input as any))),

        findFirst: procedure
            .input(CourseInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(CourseInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(CourseInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).course.findMany(input as any))),

        update: procedure
            .input(CourseInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).course.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.CourseCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CourseCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CourseGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CourseGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CourseCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CourseCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CourseGetPayload<T>, Context>,
            ) => Promise<Prisma.CourseGetPayload<T>>;
        };
    };
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
    update: {
        useMutation: <T extends Prisma.CourseUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CourseUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CourseGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CourseGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CourseUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CourseUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CourseGetPayload<T>, Context>,
            ) => Promise<Prisma.CourseGetPayload<T>>;
        };
    };
}
