import { createTRPCRouter } from './trpc'
import { questionsRouter } from './routers/questions'
import { sheetsRouter } from './routers/sheets'
import { settingsRouter } from './routers/settings'
import { examsRouter } from './routers/exams'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  questions: questionsRouter,
  sheets: sheetsRouter,
  settings: settingsRouter,
  exams: examsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
