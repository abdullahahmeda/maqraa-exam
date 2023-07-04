/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { QuestionInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(QuestionInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.create(input as any))),

        delete: procedure
            .input(QuestionInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.delete(input as any))),

        findFirst: procedure
            .input(QuestionInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(QuestionInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(QuestionInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).question.findMany(input as any))),

        update: procedure
            .input(QuestionInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).question.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.QuestionCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.QuestionCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.QuestionGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.QuestionGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.QuestionCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.QuestionCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.QuestionGetPayload<T>, Context>,
            ) => Promise<Prisma.QuestionGetPayload<T>>;
        };
    };
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
    update: {
        useMutation: <T extends Prisma.QuestionUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.QuestionUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.QuestionGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.QuestionGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.QuestionUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.QuestionUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.QuestionGetPayload<T>, Context>,
            ) => Promise<Prisma.QuestionGetPayload<T>>;
        };
    };
}
