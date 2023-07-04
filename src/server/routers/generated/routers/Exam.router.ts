/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { ExamInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(ExamInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.create(input as any))),

        delete: procedure
            .input(ExamInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.delete(input as any))),

        findFirst: procedure
            .input(ExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(ExamInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(ExamInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).exam.findMany(input as any))),

        update: procedure
            .input(ExamInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).exam.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.ExamCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.ExamCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.ExamGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.ExamGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.ExamCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.ExamCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExamGetPayload<T>, Context>,
            ) => Promise<Prisma.ExamGetPayload<T>>;
        };
    };
    delete: {
        useMutation: <T extends Prisma.ExamDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.ExamDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.ExamGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.ExamGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.ExamDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.ExamDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExamGetPayload<T>, Context>,
            ) => Promise<Prisma.ExamGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.ExamFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExamGetPayload<T>, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.ExamFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.ExamGetPayload<T>, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.ExamGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.ExamGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.ExamFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.ExamFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.ExamGetPayload<T>>,
                Array<Prisma.ExamGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.ExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.ExamFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.ExamFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.ExamGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.ExamGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    update: {
        useMutation: <T extends Prisma.ExamUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.ExamUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.ExamGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.ExamGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.ExamUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.ExamUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.ExamGetPayload<T>, Context>,
            ) => Promise<Prisma.ExamGetPayload<T>>;
        };
    };
}
