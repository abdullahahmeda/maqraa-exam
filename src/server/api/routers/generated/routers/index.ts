/* eslint-disable */
import {
    type AnyRouter,
    type AnyRootConfig,
    type CreateRouterInner,
    type Procedure,
    type ProcedureBuilder,
    type ProcedureParams,
    type ProcedureRouterRecord,
    type ProcedureType,
} from '@trpc/server';
import { type PrismaClient, type Prisma } from '@prisma/client';
import type z from 'zod';
import createUserRouter from './User.router';
import createQuestionRouter from './Question.router';
import createSettingRouter from './Setting.router';
import createExamRouter from './Exam.router';
import createCycleRouter from './Cycle.router';
import createCourseRouter from './Course.router';
import createCourseCorrectorRouter from './CourseCorrector.router';
import createTrackRouter from './Track.router';
import createCurriculumRouter from './Curriculum.router';
import { ClientType as UserClientType } from './User.router';
import { ClientType as QuestionClientType } from './Question.router';
import { ClientType as SettingClientType } from './Setting.router';
import { ClientType as ExamClientType } from './Exam.router';
import { ClientType as CycleClientType } from './Cycle.router';
import { ClientType as CourseClientType } from './Course.router';
import { ClientType as CourseCorrectorClientType } from './CourseCorrector.router';
import { ClientType as TrackClientType } from './Track.router';
import { ClientType as CurriculumClientType } from './Curriculum.router';

export { PrismaClient } from '@prisma/client';

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = <ProcRouterRecord extends ProcedureRouterRecord>(
    procedures: ProcRouterRecord,
) => CreateRouterInner<Config, ProcRouterRecord>;

export type ProcBuilder<Config extends BaseConfig> = ProcedureBuilder<{
    _config: Config;
    _ctx_out: Config['$types']['ctx'];
    _input_in: any;
    _input_out: any;
    _output_in: any;
    _output_out: any;
    _meta: Config['$types']['meta'];
}>;

type ExtractParamsFromProcBuilder<Builder extends ProcedureBuilder<any>> = Builder extends ProcedureBuilder<infer P>
    ? P
    : never;

type FromPromise<P extends Promise<any>> = P extends Promise<infer T> ? T : never;

type Join<A, B> = A extends symbol ? B : A & B;

export type ProcReturns<
    PType extends ProcedureType,
    PBuilder extends ProcBuilder<BaseConfig>,
    ZType extends z.ZodType,
    PPromise extends Prisma.PrismaPromise<any>,
> = Procedure<
    PType,
    ProcedureParams<
        ExtractParamsFromProcBuilder<PBuilder>['_config'],
        ExtractParamsFromProcBuilder<PBuilder>['_ctx_out'],
        Join<ExtractParamsFromProcBuilder<PBuilder>['_input_in'], z.infer<ZType>>,
        Join<ExtractParamsFromProcBuilder<PBuilder>['_input_out'], z.infer<ZType>>,
        Join<ExtractParamsFromProcBuilder<PBuilder>['_output_in'], FromPromise<PPromise>>,
        Join<ExtractParamsFromProcBuilder<PBuilder>['_output_out'], FromPromise<PPromise>>,
        ExtractParamsFromProcBuilder<PBuilder>['_meta']
    >
>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Router extends RouterFactory<BaseConfig>, Proc extends ProcBuilder<BaseConfig>>(
    router: Router,
    procedure: Proc,
) {
    return router({
        user: createUserRouter<Router, Proc>(router, procedure),
        question: createQuestionRouter<Router, Proc>(router, procedure),
        setting: createSettingRouter<Router, Proc>(router, procedure),
        exam: createExamRouter<Router, Proc>(router, procedure),
        cycle: createCycleRouter<Router, Proc>(router, procedure),
        course: createCourseRouter<Router, Proc>(router, procedure),
        courseCorrector: createCourseCorrectorRouter<Router, Proc>(router, procedure),
        track: createTrackRouter<Router, Proc>(router, procedure),
        curriculum: createCurriculumRouter<Router, Proc>(router, procedure),
    });
}

export interface ClientType<AppRouter extends AnyRouter> {
    user: UserClientType<AppRouter>;
    question: QuestionClientType<AppRouter>;
    setting: SettingClientType<AppRouter>;
    exam: ExamClientType<AppRouter>;
    cycle: CycleClientType<AppRouter>;
    course: CourseClientType<AppRouter>;
    courseCorrector: CourseCorrectorClientType<AppRouter>;
    track: TrackClientType<AppRouter>;
    curriculum: CurriculumClientType<AppRouter>;
}
