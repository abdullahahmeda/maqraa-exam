import { createTRPCRouter, createCallerFactory } from './trpc'

import { courseRouter } from './routers/course'
import { cycleRouter } from './routers/cycle'
import { trackRouter } from './routers/track'
import { curriculumRouter } from './routers/curriculum'
import { settingRouter } from './routers/setting'
import { userRouter } from './routers/user'
import { sheetRouter } from './routers/sheet'
import { questionRouter } from './routers/question'
import { questionStyleRouter } from './routers/question-style'
import { errorReportRouter } from './routers/error-report'
import { systemExamRouter } from './routers/system-exam'
import { quizRouter } from './routers/quiz'
import { modelQuestionRouter } from './routers/model-question'
import { notificationRouter } from './routers/notification'

// import { studentRouter } from './routers/student'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */

export const appRouter = createTRPCRouter({
  course: courseRouter,
  cycle: cycleRouter,
  track: trackRouter,
  curriculum: curriculumRouter,
  setting: settingRouter,
  user: userRouter,
  sheet: sheetRouter,
  question: questionRouter,
  questionStyle: questionStyleRouter,
  errorReport: errorReportRouter,
  exam: systemExamRouter,
  quiz: quizRouter,
  modelQuestion: modelQuestionRouter,
  notification: notificationRouter,
  // student: studentRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
