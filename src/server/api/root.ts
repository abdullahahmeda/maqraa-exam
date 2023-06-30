import { createTRPCRouter } from './trpc'
import { questionsRouter } from './routers/questions'
import { sheetsRouter } from './routers/sheets'
import { settingsRouter } from './routers/settings'
import { examsRouter } from './routers/exams'
import { emailsrouter } from './routers/emails'
import { coursesRouter } from './routers/courses'
import { curriculaRouter } from './routers/curricula'
import { usersRouter } from './routers/users'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  questions: questionsRouter,
  sheets: sheetsRouter,
  settings: settingsRouter,
  exams: examsRouter,
  emails: emailsrouter,
  courses: coursesRouter,
  curricula: curriculaRouter,
  users: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
