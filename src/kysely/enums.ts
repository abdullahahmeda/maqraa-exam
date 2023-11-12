export const UserRole = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  CORRECTOR: 'CORRECTOR',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
export const QuestionType = {
  WRITTEN: 'WRITTEN',
  MCQ: 'MCQ',
} as const
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]
export const QuestionDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const
export type QuestionDifficulty =
  (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty]
export const QuizType = {
  WHOLE_CURRICULUM: 'WHOLE_CURRICULUM',
  FIRST_MEHWARY: 'FIRST_MEHWARY',
  SECOND_MEHWARY: 'SECOND_MEHWARY',
} as const
export type QuizType = (typeof QuizType)[keyof typeof QuizType]
export const QuestionsGroupType = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
} as const
export type QuestionsGroupType =
  (typeof QuestionsGroupType)[keyof typeof QuestionsGroupType]
