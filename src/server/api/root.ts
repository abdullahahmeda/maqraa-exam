import { createTRPCRouter, mergeRouters, publicProcedure } from './trpc'
import { createRouter } from './routers/generated/routers'
import { questionRouter } from './routers/custom/question'
import { sheetRouter } from './routers/custom/sheet'
// import { settingsRouter } from './routers/settings'
import { quizRouter } from './routers/custom/quizzes'
// // import { emailsrouter } from './routers/emails'
import { courseRouter } from './routers/custom/course'
import { cycleRouter } from './routers/custom/cycle'
import { trackRouter } from './routers/custom/track'
import { curriculumRouter } from './routers/custom/curriculum'
import { userRouter } from './routers/custom/user'
import { studentRouter } from './routers/custom/student'
import { errorReportRouter } from './routers/custom/error-report'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */

const generatedRouter = createRouter(createTRPCRouter, publicProcedure)
export const appRouter = mergeRouters(
  generatedRouter,
  courseRouter,
  cycleRouter,
  trackRouter,
  curriculumRouter,
  studentRouter,
  userRouter,
  quizRouter,
  sheetRouter,
  questionRouter,
  errorReportRouter
)

export type AppRouter = typeof appRouter
