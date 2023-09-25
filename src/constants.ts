export const SPREADSHEET_URL_REGEX = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/

export enum QuestionType {
  WRITTEN = 'WRITTEN',
  MCQ = 'MCQ',
}

export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionStyle {
  TRUE_OR_FALSE = 'TRUE_OR_FALSE',
  CHOOSE = 'CHOOSE',
  RAWI = 'RAWI',
  ANSWER = 'ANSWER',
  MENTION = 'MENTION',
  COMPLETE = 'COMPLETE',
  NUMBER = 'NUMBER',
  EVIDENCE = 'EVIDENCE',
  WHO_SAID = 'WHO_SAID',
}

export enum SettingKey {
  EASY_MCQ_QUESTIONS = 'EASY_MCQ_QUESTIONS',
  EASY_WRITTEN_QUESTIONS = 'EASY_WRITTEN_QUESTIONS',
  MEDIUM_MCQ_QUESTIONS = 'MEDIUM_MCQ_QUESTIONS',
  MEDIUM_WRITTEN_QUESTIONS = 'MEDIUM_WRITTEN_QUESTIONS',
  HARD_MCQ_QUESTIONS = 'HARD_MCQ_QUESTIONS',
  HARD_WRITTEN_QUESTIONS = 'HARD_WRITTEN_QUESTIONS',
}

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}
