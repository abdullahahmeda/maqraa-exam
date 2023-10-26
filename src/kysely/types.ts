import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type {
  UserRole,
  QuestionType,
  QuestionStyle,
  QuestionDifficulty,
  QuizType,
} from './enums'

export type Account = {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}
export type Corrector = {
  id: string
  userId: string
  cycleId: string | null
}
export type Course = {
  id: string
  name: string
}
export type CourseCorrector = {
  id: string
  courseId: string
  correctorId: string
}
export type Curriculum = {
  id: string
  name: string
  trackId: string
}
export type CurriculumPart = {
  id: Generated<number>
  name: string
  number: number
  from: number
  mid: number
  to: number
  curriculumId: string
}
export type Cycle = {
  id: string
  name: string
}
export type CycleCourse = {
  id: Generated<number>
  courseId: string
  cycleId: string
}
export type ErrorReport = {
  id: string
  name: string
  email: string
  note: string
  createdAt: Generated<Timestamp>
  questionId: string
}
export type Question = {
  id: string
  number: number
  pageNumber: number
  partNumber: number
  hadithNumber: number
  type: QuestionType
  style: QuestionStyle
  difficulty: QuestionDifficulty
  text: string
  textForTrue: string | null
  textForFalse: string | null
  option1: string | null
  option2: string | null
  option3: string | null
  option4: string | null
  answer: string
  anotherAnswer: string
  isInsideShaded: boolean
  objective: string
  courseId: string
}
export type QuestionsGroup = {
  id: string
  questionsNumber: number
  gradePerQuestion: number
  order: number
  difficulty: QuestionDifficulty | null
  styleOrType: string | null
  quizId: string | null
  systemExamId: string | null
}
export type Quiz = {
  id: string
  type: Generated<QuizType>
  grade: number | null
  percentage: number | null
  total: number | null
  questionsCreated: Generated<boolean>
  createdAt: Generated<Timestamp>
  enteredAt: Timestamp | null
  submittedAt: Timestamp | null
  correctedAt: Timestamp | null
  endsAt: Timestamp | null
  repeatFromSameHadith: Generated<boolean>
  curriculumId: string
  examineeId: string | null
  correctorId: string | null
  systemExamId: string | null
}
export type QuizQuestion = {
  id: string
  answer: string | null
  order: Generated<number>
  grade: Generated<number>
  weight: number
  questionId: string
  quizId: string
}
export type ResetPasswordToken = {
  token: string
  userId: string
  expires: Timestamp
}
export type Session = {
  id: string
  sessionToken: string
  userId: string
  expires: Timestamp
}
export type Setting = {
  key: string
  value: string
}
export type Student = {
  id: string
  userId: string
}
export type StudentCycle = {
  id: Generated<number>
  studentId: string
  cycleId: string
  curriculumId: string
}
export type SystemExam = {
  id: string
  name: string
  type: QuizType
  createdAt: Generated<Timestamp>
  endsAt: Timestamp | null
  repeatFromSameHadith: Generated<boolean>
  curriculumId: string
  cycleId: string
}
export type Track = {
  id: string
  name: string
  courseId: string
}
export type User = {
  id: string
  name: string
  email: string
  emailVerified: Timestamp | null
  /**
   * @password(saltLength: 12)
   * @omit
   */
  password: string
  image: string | null
  phone: string | null
  role: UserRole
}
export type VerificationToken = {
  identifier: string
  token: string
  expires: Timestamp
}
export type DB = {
  Account: Account
  Corrector: Corrector
  Course: Course
  CourseCorrector: CourseCorrector
  Curriculum: Curriculum
  CurriculumPart: CurriculumPart
  Cycle: Cycle
  CycleCourse: CycleCourse
  ErrorReport: ErrorReport
  Question: Question
  QuestionsGroup: QuestionsGroup
  Quiz: Quiz
  QuizQuestion: QuizQuestion
  ResetPasswordToken: ResetPasswordToken
  Session: Session
  Setting: Setting
  Student: Student
  StudentCycle: StudentCycle
  SystemExam: SystemExam
  Track: Track
  User: User
  VerificationToken: VerificationToken
}
