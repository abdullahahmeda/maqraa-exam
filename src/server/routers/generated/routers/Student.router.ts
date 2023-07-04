/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { StudentInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(StudentInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).student.create(input as any))),

        delete: procedure
            .input(StudentInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).student.delete(input as any))),

        findFirst: procedure
            .input(StudentInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).student.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(StudentInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).student.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(StudentInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).student.findMany(input as any))),

        update: procedure
            .input(StudentInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).student.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.StudentCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.StudentCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.StudentGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.StudentGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.StudentCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.StudentCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.StudentGetPayload<T>, Context>,
            ) => Promise<Prisma.StudentGetPayload<T>>;
        };
    };
    delete: {
        useMutation: <T extends Prisma.StudentDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.StudentDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.StudentGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.StudentGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.StudentDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.StudentDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.StudentGetPayload<T>, Context>,
            ) => Promise<Prisma.StudentGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.StudentFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.StudentFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.StudentGetPayload<T>, Prisma.StudentGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.StudentGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.StudentFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.StudentFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.StudentGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.StudentGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.StudentFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.StudentFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.StudentGetPayload<T>, Prisma.StudentGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.StudentGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.StudentFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.StudentFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.StudentGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.StudentGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.StudentFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.StudentFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.StudentGetPayload<T>>,
                Array<Prisma.StudentGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.StudentGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.StudentFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.StudentFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.StudentGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.StudentGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    update: {
        useMutation: <T extends Prisma.StudentUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.StudentUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.StudentGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.StudentGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.StudentUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.StudentUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.StudentGetPayload<T>, Context>,
            ) => Promise<Prisma.StudentGetPayload<T>>;
        };
    };
}
