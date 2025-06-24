import { z } from 'zod'

export const addStudentToExamSchema = z.object({
  userId: z.string(),
  examId: z.string()
})

export type AddStudentToExamSchema = z.infer<typeof addStudentToExamSchema>
