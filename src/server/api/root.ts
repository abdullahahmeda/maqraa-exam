import { createTRPCRouter, mergeRouters, publicProcedure } from './trpc'
import { createRouter } from './routers/generated/routers'
import { questionRouter } from './routers/custom/question'
import { sheetRouter } from './routers/custom/sheet'
// import { settingsRouter } from './routers/settings'
import { examRouter } from './routers/custom/exam'
// // import { emailsrouter } from './routers/emails'
import { courseRouter } from './routers/custom/course'
import { cycleRouter } from './routers/custom/cycle'
import { trackRouter } from './routers/custom/track'
import { curriculumRouter } from './routers/custom/curriculum'
import { userRouter } from './routers/custom/user'
import { studentRouter } from './routers/custom/student'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */

const generatedRouter = createRouter(createTRPCRouter, publicProcedure)
export const appRouter = mergeRouters(generatedRouter, courseRouter, cycleRouter, trackRouter, curriculumRouter, studentRouter, userRouter, examRouter, sheetRouter, questionRouter)

export type AppRouter = typeof appRouter
