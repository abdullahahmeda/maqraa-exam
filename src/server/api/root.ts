import { createTRPCRouter } from './trpc'
import { questionRouter } from './routers/custom/question'
import { sheetRouter } from './routers/custom/sheet'
import { quizRouter } from './routers/custom/quiz'
import { courseRouter } from './routers/custom/course'
import { cycleRouter } from './routers/custom/cycle'
import { trackRouter } from './routers/custom/track'
import { curriculumRouter } from './routers/custom/curriculum'
import { userRouter } from './routers/custom/user'
// import { studentRouter } from './routers/custom/student'
import { errorReportRouter } from './routers/custom/error-report'
import { systemExamRouter } from './routers/custom/system-exam'
import { questionStyleRouter } from './routers/custom/question-style'

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
  // student: studentRouter,
  user: userRouter,
  quiz: quizRouter,
  sheet: sheetRouter,
  question: questionRouter,
  errorReport: errorReportRouter,
  systemExam: systemExamRouter,
  questionStyle: questionStyleRouter,
})

export type AppRouter = typeof appRouter
