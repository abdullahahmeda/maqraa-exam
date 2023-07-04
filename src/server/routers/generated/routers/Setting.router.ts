/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { SettingInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(SettingInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.create(input as any))),

        delete: procedure
            .input(SettingInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.delete(input as any))),

        findFirst: procedure
            .input(SettingInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(SettingInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(SettingInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).setting.findMany(input as any))),

        update: procedure
            .input(SettingInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).setting.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.SettingCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.SettingCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SettingGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.SettingGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.SettingCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.SettingCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SettingGetPayload<T>, Context>,
            ) => Promise<Prisma.SettingGetPayload<T>>;
        };
    };
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
    update: {
        useMutation: <T extends Prisma.SettingUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.SettingUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SettingGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.SettingGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.SettingUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.SettingUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SettingGetPayload<T>, Context>,
            ) => Promise<Prisma.SettingGetPayload<T>>;
        };
    };
}
