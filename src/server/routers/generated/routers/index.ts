/* eslint-disable */
import { AnyRootConfig } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { createRouterFactory } from '@trpc/server/dist/core/router';
import { createBuilder } from '@trpc/server/dist/core/internals/procedureBuilder';
import createUserRouter from './User.router';
import createQuestionRouter from './Question.router';
import createSettingRouter from './Setting.router';
import createExamRouter from './Exam.router';
import createCycleRouter from './Cycle.router';
import createCourseRouter from './Course.router';
import createTrackRouter from './Track.router';
import createCurriculumRouter from './Curriculum.router';

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = ReturnType<typeof createRouterFactory<Config>>;

export type ProcBuilder<Config extends BaseConfig> = ReturnType<typeof createBuilder<Config>>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({
        user: createUserRouter<Config>(router, procedure),
        question: createQuestionRouter<Config>(router, procedure),
        setting: createSettingRouter<Config>(router, procedure),
        exam: createExamRouter<Config>(router, procedure),
        cycle: createCycleRouter<Config>(router, procedure),
        course: createCourseRouter<Config>(router, procedure),
        track: createTrackRouter<Config>(router, procedure),
        curriculum: createCurriculumRouter<Config>(router, procedure),
    });
}
