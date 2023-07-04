/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from '.';
import { CurriculumInputSchema } from '@zenstackhq/runtime/zod/input';
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
            .input(CurriculumInputSchema.create)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.create(input as any))),

        delete: procedure
            .input(CurriculumInputSchema.delete)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.delete(input as any))),

        findFirst: procedure
            .input(CurriculumInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirst(input as any))),

        findFirstOrThrow: procedure
            .input(CurriculumInputSchema.findFirst)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findFirstOrThrow(input as any))),

        findMany: procedure
            .input(CurriculumInputSchema.findMany)
            .query(({ ctx, input }) => checkRead(db(ctx).curriculum.findMany(input as any))),

        update: procedure
            .input(CurriculumInputSchema.update)
            .mutation(async ({ ctx, input }) => checkMutate(db(ctx).curriculum.update(input as any))),
    });
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    create: {
        useMutation: <T extends Prisma.CurriculumCreateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CurriculumCreateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CurriculumGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CurriculumGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CurriculumCreateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CurriculumCreateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CurriculumGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CurriculumGetPayload<T>>;
        };
    };
    delete: {
        useMutation: <T extends Prisma.CurriculumDeleteArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CurriculumDeleteArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CurriculumGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CurriculumGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CurriculumDeleteArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CurriculumDeleteArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CurriculumGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CurriculumGetPayload<T>>;
        };
    };
    findFirst: {
        useQuery: <T extends Prisma.CurriculumFindFirstArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindFirstArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumGetPayload<T>,
                Prisma.CurriculumGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findFirstOrThrow: {
        useQuery: <T extends Prisma.CurriculumFindFirstOrThrowArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindFirstOrThrowArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Prisma.CurriculumGetPayload<T>,
                Prisma.CurriculumGetPayload<T>,
                Error
            >,
        ) => UseTRPCQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindFirstOrThrowArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindFirstOrThrowArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CurriculumGetPayload<T>, Error>,
        ) => UseTRPCInfiniteQueryResult<Prisma.CurriculumGetPayload<T>, TRPCClientErrorLike<AppRouter>>;
    };
    findMany: {
        useQuery: <T extends Prisma.CurriculumFindManyArgs>(
            input: Prisma.SelectSubset<T, Prisma.CurriculumFindManyArgs>,
            opts?: UseTRPCQueryOptions<
                string,
                T,
                Array<Prisma.CurriculumGetPayload<T>>,
                Array<Prisma.CurriculumGetPayload<T>>,
                Error
            >,
        ) => UseTRPCQueryResult<Array<Prisma.CurriculumGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
        useInfiniteQuery: <T extends Prisma.CurriculumFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CurriculumFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CurriculumGetPayload<T>>, Error>,
        ) => UseTRPCInfiniteQueryResult<Array<Prisma.CurriculumGetPayload<T>>, TRPCClientErrorLike<AppRouter>>;
    };
    update: {
        useMutation: <T extends Prisma.CurriculumUpdateArgs>(
            opts?: UseTRPCMutationOptions<
                Prisma.CurriculumUpdateArgs,
                TRPCClientErrorLike<AppRouter>,
                Prisma.CurriculumGetPayload<null>,
                Context
            >,
        ) => Omit<
            UseTRPCMutationResult<
                Prisma.CurriculumGetPayload<T>,
                TRPCClientErrorLike<AppRouter>,
                Prisma.SelectSubset<T, Prisma.CurriculumUpdateArgs>,
                Context
            >,
            'mutateAsync'
        > & {
            mutateAsync: <T extends Prisma.CurriculumUpdateArgs>(
                variables: T,
                opts?: UseTRPCMutationOptions<
                    T,
                    TRPCClientErrorLike<AppRouter>,
                    Prisma.CurriculumGetPayload<T>,
                    Context
                >,
            ) => Promise<Prisma.CurriculumGetPayload<T>>;
        };
    };
}
