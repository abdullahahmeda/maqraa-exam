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
export const QuestionStyle = {
  TRUE_OR_FALSE: 'TRUE_OR_FALSE',
  CHOOSE: 'CHOOSE',
  RAWI: 'RAWI',
  ANSWER: 'ANSWER',
  MENTION: 'MENTION',
  COMPLETE: 'COMPLETE',
  NUMBER: 'NUMBER',
  EVIDENCE: 'EVIDENCE',
  WHO_SAID: 'WHO_SAID',
} as const
export type QuestionStyle = (typeof QuestionStyle)[keyof typeof QuestionStyle]
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
