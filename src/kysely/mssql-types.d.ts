import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface _MigrationHistory {
  ContextKey: string;
  MigrationId: string;
  Model: Buffer;
  ProductVersion: string;
}

export interface Alert {
  AlertID: Generated<number>;
  AlertName: string | null;
  AlertTypeID: number | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  HexColor: string | null;
  LanguageID: number | null;
  Message: string | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  StudentID: number;
}

export interface AlertType {
  AlertTypeID: Generated<number>;
  AlertTypeName: string | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  HexColor: string | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface ArabicLevel {
  ArabicLevelID: Generated<number>;
  ArabicLevelName: string | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface AspNetRoles {
  Id: string;
  Name: string;
}

export interface AspNetUserClaims {
  ClaimType: string | null;
  ClaimValue: string | null;
  Id: Generated<number>;
  UserId: string;
}

export interface AspNetUserLogins {
  LoginProvider: string;
  ProviderKey: string;
  UserId: string;
}

export interface AspNetUserRoles {
  RoleId: string;
  UserId: string;
}

export interface AspNetUsers {
  AccessFailedCount: number;
  Email: string | null;
  EmailConfirmed: boolean;
  FullName: string | null;
  Id: string;
  IsStudent: Generated<boolean>;
  LockoutEnabled: boolean;
  LockoutEndDateUtc: Date | null;
  PasswordHash: string | null;
  PhoneNumber: string | null;
  PhoneNumberConfirmed: boolean;
  SecurityStamp: string | null;
  TwoFactorEnabled: boolean;
  UserName: string;
}

export interface CertificateTemplate {
  CreateDate: Date | null;
  CreatedBy: string | null;
  DeleteDate: Date | null;
  DeletedBy: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  ModifiedBy: string | null;
  ModifyDate: Date | null;
  PlaceHolders: string;
  TemplateFile: string;
  TemplateFileType: number;
  TemplateName: string;
}

export interface Cities {
  CityName: string;
  CountryId: number;
  Deleted: Generated<boolean>;
  Id: Generated<number>;
}

export interface ContactUS {
  ContactID: Generated<number>;
  ContactName: string | null;
  CountryID: number | null;
  Email: string | null;
  IPAdress: string | null;
  LanguageID: number;
  Message: string | null;
  Phone: string | null;
  SentDate: Date | null;
  SentDateHijri: string | null;
}

export interface ContactUsResponses {
  ContactID: number | null;
  ID: Generated<number>;
  Message: string | null;
  SenderEmail: string | null;
  SentDate: Date | null;
  SentDateHijri: string | null;
}

export interface Countries {
  Code: string | null;
  CountryName: string;
  Deleted: Generated<boolean>;
  Id: Generated<number>;
}

export interface Country {
  CountryID: Generated<number>;
  CountryName: string | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  IslamicWorld: number;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface CoursePathMethods {
  CoursePathId: number;
  CreatedAt: Date | null;
  CreatedBy: string | null;
  DeletedAt: Date | null;
  DeletedBy: string | null;
  HadithCount: number | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  MethodName: string;
  ModifiedAt: Date | null;
  ModifiedBy: string | null;
  PagesCount: number | null;
  PagesHadith: string | null;
  PathFile: string | null;
  SecondPathFile: string | null;
  StartPage: Generated<number>;
}

export interface CoursePaths {
  CourseId: number | null;
  CoursePathName: string;
  CreatedAt: Date | null;
  CreatedBy: string | null;
  DeletedAt: Date | null;
  DeletedBy: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  ModifiedAt: Date | null;
  ModifiedBy: string | null;
  PathFile: string | null;
}

export interface Courses {
  CourseName: string;
  CreatedAt: Date | null;
  CreatedBy: string | null;
  DeletedAt: Date | null;
  DeletedBy: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  ModifiedAt: Date | null;
  ModifiedBy: string | null;
}

export interface CourseTypes {
  CourseTypeName: string;
  CreatedAt: Date | null;
  CreatedBy: string | null;
  DeletedAt: Date | null;
  DeletedBy: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  ModifiedAt: Date | null;
  ModifiedBy: string | null;
}

export interface EducationLevels {
  Deleted: Generated<boolean>;
  EducationLevelName: string;
  Id: Generated<number>;
}

export interface Faqs {
  Answer: string | null;
  Id: Generated<number>;
  Question: string | null;
}

export interface Faraa {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  FaraaID: Generated<number>;
  FaraaName: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface Halaqa {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  HalaqaID: Generated<number>;
  HalaqaName: string | null;
  LanguageID: number | null;
  LinkStudent: string | null;
  LinkTeacher: string | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  PeriodID: number | null;
  TeacherID: number | null;
}

export interface HomeSettings {
  FriendlyName: string | null;
  Id: Generated<number>;
  IsHtml: boolean;
  SettingKey: string;
  SettingValue: string | null;
}

export interface Inbox {
  /**
   * 1:User ; 2: Teacher; 3:Student
   */
  BeneficiaryTypeID: number | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  InboxID: Generated<number>;
  IsReaded: number | null;
  LanguageID: number | null;
  MessageBody: string | null;
  NotificationID: number | null;
  ReadedDate: string | null;
  ReadedDateHijri: string | null;
  ReceiverEmail: string | null;
  ReceiverID: number | null;
}

export interface InboxMessages {
  FromUserId: string;
  Id: Generated<number>;
  IsRead: Generated<boolean>;
  IsReceiverDeleted: boolean;
  IsSenderDeleted: Generated<boolean>;
  MessageBody: string | null;
  SendDate: Date;
  Subject: string | null;
  ToUserId: string;
}

export interface Interview {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  Description: string | null;
  InterviewDate: string | null;
  InterviewDateHijri: string | null;
  InterviewID: Generated<number>;
  InterviewName: string | null;
  InterviewTime: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface IslamicWorld {
  IslamicWorldID: Generated<number>;
  IslamicWorldName: string | null;
}

export interface Job {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  JobID: Generated<number>;
  JobName: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface Language {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: Generated<number>;
  LanguageName: string | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface Memorized {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  MemorizedID: Generated<number>;
  MemorizedName: string | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
}

export interface MessageSent {
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  Email: string | null;
  IsSent: number | null;
  MessageBody: string | null;
  MessageSentID: Generated<number>;
  Mobile: string | null;
  SentDate: string | null;
  SentDateHijri: string | null;
  Subject: string | null;
  TypeID: number | null;
}

export interface News {
  FullText: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  NewsDate: Date;
  NewsImage: string | null;
  NewsTitle: string;
  ShortDescription: string | null;
}

export interface Notification {
  /**
   * 0:All; 1:User ; 2: Teacher; 3:Student;
   */
  BeneficiaryTypeID: number | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  IsSent: number | null;
  LanguageID: number | null;
  MessageBody: string | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  NotificationID: Generated<number>;
  NotificationName: string | null;
  SentDate: string | null;
  SentDateHijri: string | null;
}

export interface NotificationAttach {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  FileName: string | null;
  FilePath: string | null;
  NotificationAttachID: Generated<number>;
  NotificationID: number | null;
}

export interface Pages {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDateHijri: string | null;
  ModofiedDate: string | null;
  PageContent: string | null;
  PageID: Generated<number>;
  PageName: string | null;
}

export interface PasswordReset {
  ChangeDate: string | null;
  ChangeDateHijri: string | null;
  ID: Generated<number>;
  NewPassword: string | null;
  OldPassword: string | null;
  ParticipantID: number | null;
  ParticipantTypeID: number | null;
}

export interface Period {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  PeriodID: Generated<number>;
  PeriodName: string | null;
}

export interface Qualification {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  QualificationID: Generated<number>;
  QualificationName: string | null;
}

export interface RegisterationPeriods {
  AvailableCourses: string | null;
  AvailableReviewTimes: string | null;
  EndTime: Date | null;
  Id: Generated<number>;
  Notes: string | null;
  PeriodName: string;
  ShowCity: Generated<boolean>;
  ShowCourse: Generated<boolean>;
  StartDate: Date | null;
}

export interface Registration {
  ArabicLevelID: number | null;
  BirthDate: string | null;
  BirthDateHijri: string | null;
  Email: string | null;
  FaraaID: number | null;
  FullNameAr: string | null;
  FullNameEn: string | null;
  HalaqaID: number | null;
  InterviewID: number | null;
  JobID: number | null;
  LanguageID: number | null;
  MemorizedID: number | null;
  NationalityID: number | null;
  Password: string | null;
  PeriodID: number | null;
  QualificationID: number | null;
  RegistrationDate: string | null;
  RegistrationDateHijri: string | null;
  RegistrationID: Generated<number>;
  RegistrationStatusID: number | null;
  ResidenceiD: number | null;
  RewayaID: number | null;
  SexID: number | null;
  TermID: number | null;
}

export interface RegistrationAction {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDatehijri: string | null;
  HalaqaID: number | null;
  InterviewiD: number | null;
  RegistrationActionID: Generated<number>;
  RegistrationID: number | null;
  RegistrationStatusID: number | null;
  TermID: number | null;
}

export interface RegistrationPeriod {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  EndDate: string | null;
  EndDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  Note: string | null;
  RegistrationPeriodID: Generated<number>;
  RegistrationPeriodName: string | null;
  StartDate: string | null;
  StartDateHijri: string | null;
}

export interface RegistrationStatus {
  LanguageID: number;
  StatusID: Generated<number>;
  StatusName: string | null;
}

export interface ReviewTimes {
  Deleted: Generated<boolean>;
  Id: Generated<number>;
  ReviewTimeName: string;
}

export interface Rewaya {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  RewayaID: Generated<number>;
  RewayaName: string | null;
}

export interface Rings {
  Deleted: Generated<boolean>;
  Id: Generated<number>;
  RingName: string;
  StudentLink: string | null;
  TeacherId: string | null;
  TeacherLink: string | null;
}

export interface RingStudentHistories {
  ActionDate: Date | null;
  ActionName: string | null;
  Id: Generated<number>;
  RingId: number;
  StudentId: number;
}

export interface RingStudents {
  RingId: number;
  StudentId: number;
}

export interface RingSupervisors {
  AddDate: Date;
  RingId: number;
  SupervisorId: string;
}

export interface RingTimes {
  DayName: string;
  Id: Generated<number>;
  RingId: number;
  RingTime: Date;
}

export interface Sejel {
  AyaFrom: number | null;
  AyaTo: number | null;
  Mark: number | null;
  Note: string | null;
  PresenceID: number | null;
  SejelDate: string | null;
  SejelDateHijri: string | null;
  SejelID: Generated<number>;
  SouratIDFrom: number | null;
  SouratIDTo: number | null;
  StudentID: number | null;
}

export interface Settings {
  AcademyNameAr: string | null;
  AcademyNameEn: string | null;
  CurriculumLink: string | null;
  Email: string | null;
  HoursForActivation: number | null;
  ID: Generated<number>;
  LanguageID: number;
  Logo: string | null;
  MessageRegistration: string | null;
  URL: string | null;
}

export interface Sex {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  SexID: Generated<number>;
  SexName: string | null;
}

export interface Slider {
  Actif: number | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  DisplayOrder: number | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  Path: string | null;
  SliderID: Generated<number>;
  SliderName: string | null;
}

export interface Sourat {
  ArabicID: number | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  PartID: number | null;
  SouratID: Generated<number>;
  SouratName: string | null;
  SouratNumber: number | null;
}

export interface Student {
  ArabicLevelID: number | null;
  BirthDate: string | null;
  BirthDateHijri: string | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  Email: string | null;
  FaraaID: number | null;
  FullNameAr: string | null;
  FullNameEn: string | null;
  HalaqaID: number | null;
  InterviewID: number | null;
  JobID: number | null;
  LanguageID: number | null;
  MemorizedID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  NationalityID: number | null;
  Password: string | null;
  PeriodID: number | null;
  QualificationID: number | null;
  RegistrationStatusID: number | null;
  ResidenceiD: number | null;
  RewayaID: number | null;
  SexID: number | null;
  StatusId: number | null;
  StudentID: Generated<number>;
  TermID: number | null;
}

export interface StudentAction {
  ActionTypeID: number | null;
  FaraaID: number | null;
  HalaqaID: number | null;
  LanguageID: number | null;
  Note: string | null;
  PeriodID: number | null;
  RiwayaID: number | null;
  StudentActionDateHijri: string | null;
  StudentActionID: Generated<number>;
  StudentID: number | null;
  StuentActionDate: string | null;
}

export interface StudentAttendences {
  AttendDate: Date | null;
  CourseName: string | null;
  CoursePathMethodName: string | null;
  CoursePathName: string | null;
  CourseTypeName: string | null;
  Execuse: string | null;
  Id: Generated<number>;
  IsAttended: Generated<number>;
  RingId: number | null;
  StudentId: number;
  StudentName: string | null;
}

export interface StudentCertificates {
  CertificateFileName: string | null;
  CourseId: number | null;
  CourseName: string | null;
  CoursePathId: number | null;
  CoursePathMethodId: number | null;
  CoursePathMethodName: string | null;
  CoursePathName: string | null;
  CourseTypeId: number | null;
  CourseTypeName: string | null;
  CreateDate: Date | null;
  CreatedBy: string | null;
  DeleteDate: Date | null;
  DeletedBy: string | null;
  Id: Generated<number>;
  IsDeleted: Generated<boolean>;
  ModifiedBy: string | null;
  ModifyDate: Date | null;
  StudentId: number;
  StudentName: string | null;
  TemplateId: number | null;
}

export interface StudentCourseReviews {
  CourseName: string | null;
  CoursePathMethodName: string | null;
  CoursePathName: string | null;
  CourseTypeName: string | null;
  Grade: string | null;
  HadithFrom: string | null;
  HadithTo: string | null;
  Id: Generated<number>;
  KeepType: number | null;
  PageFrom: string | null;
  PageTo: string | null;
  ReviewDate: Date | null;
  ReviewFrom: string | null;
  ReviewTo: string | null;
  RingId: number | null;
  StudentCourseId: number;
  StudentId: number;
  StudentName: string | null;
  TeacherId: string | null;
}

export interface StudentCourses {
  CourseId: number;
  CoursePathId: number | null;
  CoursePathMethodId: number | null;
  CourseTypeId: number | null;
  Id: Generated<number>;
  StudentId: number;
}

export interface StudentExam {
  Mark: number | null;
  Month: number | null;
  MonthHijri: number | null;
  StudenExamID: Generated<number>;
  StudentExamDate: string | null;
  StudentExamDateHijri: string | null;
  StudentID: number | null;
  Year: number | null;
  YearHijri: number | null;
}

export interface StudentReviewTimes {
  ReviewTimeId: number;
  StudentId: number;
}

export interface Students {
  BirthDate: Date | null;
  EducationLevelId: number | null;
  FullName: string | null;
  Gender: string;
  Id: Generated<number>;
  IDPassword: string | null;
  NationalityId: number | null;
  Phone: string | null;
  QuraanKeepingAmount: number | null;
  ResidenceCityId: number | null;
  ResidenceCountryId: number | null;
  StatusId: number | null;
  UserId: string;
}

export interface StudentsInterviews {
  Id: Generated<number>;
  InterviewDate: Date | null;
  InterviewResult: boolean | null;
  LinkUrl: string | null;
  QuraanDegree: number | null;
  ScienceDegree: number | null;
  StudentId: number;
  SupervisorId: string;
  TotalDegree: number | null;
}

export interface Teacher {
  BirthDate: string | null;
  BirthDateHijri: string | null;
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  Deleted: number | null;
  IsActif: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  SexID: number | null;
  StartDateHijri: string | null;
  StratDate: string | null;
  TeacherCategoryID: number | null;
  TeacherEmail: string | null;
  TeacherID: Generated<number>;
  TeacherMobile: string | null;
  TeacherName: string | null;
  TeacherNameEn: string | null;
  TeacherPassword: string | null;
  TeacherQualificationID: number | null;
}

export interface TeacherAction {
  ActionDate: string | null;
  ActionDateHijri: string | null;
  ActionTypeID: number | null;
  HalaqaID: number | null;
  Note: string | null;
  TeacherActionID: Generated<number>;
  TeacherID: number | null;
}

export interface TeacherCategory {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  TeacherCategoryID: Generated<number>;
  TeacherCategoryName: string | null;
}

export interface TeacherQualification {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  TeacherQualificationID: Generated<number>;
  TeacherQualificationName: string | null;
}

export interface Term {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  EndDate: string | null;
  EndDateHijri: string | null;
  IsCurrent: number | null;
  LanguageID: number | null;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  StartDate: string | null;
  StartDateHijri: string | null;
  TermID: Generated<number>;
  TermName: string | null;
  TermNumber: number | null;
  Year: number | null;
  YearHijri: number | null;
}

export interface UserRole {
  UserRoleID: Generated<number>;
  UserRoleName: string | null;
}

export interface Users {
  Name: string | null;
  Password: string | null;
  UserID: Generated<number>;
  UserName: string | null;
  UserRoleID: number | null;
}

export interface Vote {
  CreatedBy: string | null;
  CreatedDate: string | null;
  CreatedDateHijri: string | null;
  EndDate: string | null;
  EndDateHijri: string | null;
  ForMembers: number | null;
  ForPublic: number | null;
  ForStudents: number | null;
  ForTeachers: number | null;
  LanguageID: number;
  ModifiedBy: string | null;
  ModifiedDate: string | null;
  ModifiedDateHijri: string | null;
  StartDate: string | null;
  StartDateHijri: string | null;
  VoteID: Generated<number>;
  VoteName: string | null;
}

export interface VoteDetail {
  Position: number | null;
  Text: string | null;
  VoteDetailID: Generated<number>;
  VoteID: number | null;
}

export interface VoteParticipant {
  ParticipantID: number | null;
  ParticipantTypeID: number | null;
  VoteDetailID: number | null;
  VoteID: number | null;
  VoteParticipantID: Generated<number>;
}

export interface DB {
  __MigrationHistory: _MigrationHistory;
  Alert: Alert;
  AlertType: AlertType;
  ArabicLevel: ArabicLevel;
  AspNetRoles: AspNetRoles;
  AspNetUserClaims: AspNetUserClaims;
  AspNetUserLogins: AspNetUserLogins;
  AspNetUserRoles: AspNetUserRoles;
  AspNetUsers: AspNetUsers;
  CertificateTemplate: CertificateTemplate;
  Cities: Cities;
  ContactUS: ContactUS;
  ContactUsResponses: ContactUsResponses;
  Countries: Countries;
  Country: Country;
  CoursePathMethods: CoursePathMethods;
  CoursePaths: CoursePaths;
  Courses: Courses;
  CourseTypes: CourseTypes;
  EducationLevels: EducationLevels;
  Faqs: Faqs;
  Faraa: Faraa;
  Halaqa: Halaqa;
  HomeSettings: HomeSettings;
  Inbox: Inbox;
  InboxMessages: InboxMessages;
  Interview: Interview;
  IslamicWorld: IslamicWorld;
  Job: Job;
  Language: Language;
  Memorized: Memorized;
  MessageSent: MessageSent;
  News: News;
  Notification: Notification;
  NotificationAttach: NotificationAttach;
  Pages: Pages;
  PasswordReset: PasswordReset;
  Period: Period;
  Qualification: Qualification;
  RegisterationPeriods: RegisterationPeriods;
  Registration: Registration;
  RegistrationAction: RegistrationAction;
  RegistrationPeriod: RegistrationPeriod;
  RegistrationStatus: RegistrationStatus;
  ReviewTimes: ReviewTimes;
  Rewaya: Rewaya;
  Rings: Rings;
  RingStudentHistories: RingStudentHistories;
  RingStudents: RingStudents;
  RingSupervisors: RingSupervisors;
  RingTimes: RingTimes;
  Sejel: Sejel;
  Settings: Settings;
  Sex: Sex;
  Slider: Slider;
  Sourat: Sourat;
  Student: Student;
  StudentAction: StudentAction;
  StudentAttendences: StudentAttendences;
  StudentCertificates: StudentCertificates;
  StudentCourseReviews: StudentCourseReviews;
  StudentCourses: StudentCourses;
  StudentExam: StudentExam;
  StudentReviewTimes: StudentReviewTimes;
  Students: Students;
  StudentsInterviews: StudentsInterviews;
  Teacher: Teacher;
  TeacherAction: TeacherAction;
  TeacherCategory: TeacherCategory;
  TeacherQualification: TeacherQualification;
  Term: Term;
  UserRole: UserRole;
  Users: Users;
  Vote: Vote;
  VoteDetail: VoteDetail;
  VoteParticipant: VoteParticipant;
}
