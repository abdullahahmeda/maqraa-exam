/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CycleInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(CycleInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.create(input as any))),

        delete: procedure
            .input(CycleInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.delete(input as any))),

        findFirst: procedure
            .input(CycleInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(CycleInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(CycleInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).cycle.findMany(input as any))),

        update: procedure
            .input(CycleInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).cycle.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.CycleCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CycleCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CycleGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CycleGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CycleCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CycleCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CycleGetPayload<T>, Context>,
            ) => Promise<Prisma.CycleGetPayload<T>>;
        };
    };
    delete: {
        useMutation: <T extends Prisma.CycleDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CycleDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CycleGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CycleGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CycleDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CycleDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CycleGetPayload<T>, Context>,
            ) => Promise<Prisma.CycleGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CycleFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CycleGetPayload<T>, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CycleFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CycleGetPayload<T>, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CycleGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CycleGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CycleFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CycleFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CycleGetPayload<T>>,
                Array<Prisma.CycleGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CycleGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CycleFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CycleFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CycleGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CycleGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    update: {
        useMutation: <T extends Prisma.CycleUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CycleUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CycleGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CycleGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CycleUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CycleUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CycleGetPayload<T>, Context>,
            ) => Promise<Prisma.CycleGetPayload<T>>;
        };
    };
}
