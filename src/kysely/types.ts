import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { UserRole, QuestionType, QuestionDifficulty, QuizType, QuestionsGroupType, SettingKey } from "./enums";

export type Account = {
    id: Generated<string>;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
};
export type Answer = {
    id: Generated<string>;
    answer: string | null;
    grade: number | null;
    modelQuestionId: string;
    quizId: string;
};
export type Course = {
    id: Generated<string>;
    name: string;
};
export type Curriculum = {
    id: Generated<string>;
    name: string;
    trackId: string;
};
export type CurriculumPart = {
    id: Generated<string>;
    name: string;
    number: number;
    from: number;
    mid: number;
    to: number;
    curriculumId: string;
};
export type Cycle = {
    id: Generated<string>;
    name: string;
};
export type CycleCurriculum = {
    curriculumId: string;
    cycleId: string;
};
export type ErrorReport = {
    id: Generated<string>;
    name: string | null;
    email: string | null;
    note: string;
    reply: string | null;
    createdAt: Generated<Timestamp>;
    modelQuestionId: string;
    userId: string | null;
    quizId: string | null;
};
export type MenuItem = {
    key: string;
    label: string;
    order: Generated<number>;
    icon: string | null;
    role: UserRole;
};
export type Model = {
    id: Generated<string>;
    name: string | null;
    total: number;
};
export type ModelQuestion = {
    id: Generated<string>;
    modelId: string;
    questionId: string;
    weight: number;
    order: number;
};
export type Notification = {
    id: Generated<string>;
    body: string;
    url: string | null;
};
export type Question = {
    id: Generated<string>;
    number: number;
    pageNumber: number;
    partNumber: number;
    hadithNumber: number;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    text: string;
    textForTrue: string | null;
    textForFalse: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    option4: string | null;
    answer: string;
    anotherAnswer: string;
    isInsideShaded: boolean;
    objective: string;
    courseId: string;
    styleId: string;
};
export type QuestionsGroup = {
    id: Generated<string>;
    type: Generated<QuestionsGroupType>;
    order: number;
    questionsNumber: number | null;
    gradePerQuestion: number | null;
    difficulty: QuestionDifficulty | null;
    styleOrType: string | null;
    systemExamId: string;
};
export type QuestionStyle = {
    id: Generated<string>;
    name: string;
    type: QuestionType;
    choicesColumns: string[];
};
export type Quiz = {
    id: Generated<string>;
    type: Generated<QuizType>;
    grade: number | null;
    percentage: number | null;
    createdAt: Generated<Timestamp>;
    enteredAt: Timestamp | null;
    submittedAt: Timestamp | null;
    correctedAt: Timestamp | null;
    endsAt: Timestamp | null;
    curriculumId: string | null;
    examineeId: string | null;
    correctorId: string | null;
    systemExamId: string | null;
    modelId: string;
};
export type ResetPasswordToken = {
    token: Generated<string>;
    userId: string;
    expires: Timestamp;
};
export type Session = {
    id: Generated<string>;
    sessionToken: string;
    userId: string;
    expires: Timestamp;
};
export type Setting = {
    key: SettingKey;
    value: string;
};
export type SystemExam = {
    id: Generated<string>;
    name: string;
    type: QuizType;
    createdAt: Generated<Timestamp>;
    endsAt: Timestamp | null;
    repeatFromSameHadith: Generated<boolean>;
    curriculumId: string;
    cycleId: string;
    defaultModelId: string;
};
export type Track = {
    id: Generated<string>;
    name: string;
    courseId: string;
};
export type User = {
    id: Generated<string>;
    name: string;
    email: string;
    emailVerified: Timestamp | null;
    password: string;
    image: string | null;
    phone: string | null;
    role: UserRole;
};
export type UserCycle = {
    id: Generated<string>;
    userId: string;
    cycleId: string;
    curriculumId: string;
};
export type UserNotification = {
    id: Generated<string>;
    userId: string;
    notificationId: string;
    isRead: Generated<boolean>;
    createdAt: Generated<Timestamp>;
};
export type VerificationToken = {
    identifier: string;
    token: string;
    expires: Timestamp;
};
export type DB = {
    Account: Account;
    Answer: Answer;
    Course: Course;
    Curriculum: Curriculum;
    CurriculumPart: CurriculumPart;
    Cycle: Cycle;
    CycleCurriculum: CycleCurriculum;
    ErrorReport: ErrorReport;
    MenuItem: MenuItem;
    Model: Model;
    ModelQuestion: ModelQuestion;
    Notification: Notification;
    Question: Question;
    QuestionsGroup: QuestionsGroup;
    QuestionStyle: QuestionStyle;
    Quiz: Quiz;
    ResetPasswordToken: ResetPasswordToken;
    Session: Session;
    Setting: Setting;
    SystemExam: SystemExam;
    Track: Track;
    User: User;
    UserCycle: UserCycle;
    UserNotification: UserNotification;
    VerificationToken: VerificationToken;
};
