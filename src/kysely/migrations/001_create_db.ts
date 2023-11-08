import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Next-auth
  await db.schema
    .createTable('User')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text')
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('emailVerified', 'timestamptz')
    .addColumn('password', 'varchar(100)', (col) => col.notNull())
    .addColumn('role', 'varchar(100)', (col) => col.notNull())
    .addColumn('phone', 'varchar(100)')
    .addColumn('image', 'text')
    .execute()

  await db.schema
    .createTable('Account')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('userId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'bigint')
    .addColumn('token_type', 'text')
    .addColumn('scope', 'text')
    .addColumn('id_token', 'text')
    .addColumn('session_state', 'text')
    .execute()

  await db.schema
    .createTable('Session')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('userId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('sessionToken', 'text', (col) => col.notNull().unique())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('VerificationToken')
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('Account_userId_index')
    .on('Account')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('Session_userId_index')
    .on('Session')
    .column('userId')
    .execute()

  // Application

  // Cycle
  await db.schema
    .createTable('Cycle')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .execute()

  // Course
  await db.schema
    .createTable('Course')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .execute()

  // Track
  await db.schema
    .createTable('Track')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('courseId', 'uuid', (col) =>
      col.notNull().references('Course.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Track_courseId_index')
    .on('Track')
    .column('courseId')
    .execute()

  // Curriculum
  await db.schema
    .createTable('Curriculum')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('trackId', 'uuid', (col) =>
      col.notNull().references('Track.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Curriculum_trackId_index')
    .on('Curriculum')
    .column('trackId')
    .execute()

  // CurriculumPart
  await db.schema
    .createTable('CurriculumPart')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('number', 'integer', (col) => col.notNull())
    .addColumn('from', 'integer', (col) => col.notNull())
    .addColumn('mid', 'integer', (col) => col.notNull())
    .addColumn('to', 'integer', (col) => col.notNull())
    .addColumn('curriculumId', 'uuid', (col) =>
      col.notNull().references('Curriculum.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('CurriculumPart_curriculumId_index')
    .on('CurriculumPart')
    .column('curriculumId')
    .execute()

  // Student
  await db.schema
    .createTable('Student')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('userId', 'uuid', (col) =>
      col.unique().references('User.id').onDelete('cascade').notNull()
    )
    .execute()

  await db.schema
    .createIndex('Student_userId_index')
    .on('Student')
    .column('userId')
    .execute()

  // Corrector
  await db.schema
    .createTable('Corrector')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('userId', 'uuid', (col) =>
      col.unique().references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('cycleId', 'uuid', (col) =>
      col.references('Cycle.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Corrector_userId_index')
    .on('Corrector')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('Corrector_cycleId_index')
    .on('Corrector')
    .column('cycleId')
    .execute()

  // StudentCycle
  await db.schema
    .createTable('StudentCycle')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('studentId', 'uuid', (col) =>
      col.notNull().references('Student.id').onDelete('cascade')
    )
    .addColumn('cycleId', 'uuid', (col) =>
      col.notNull().references('Cycle.id').onDelete('cascade')
    )
    .addColumn('curriculumId', 'uuid', (col) =>
      col.notNull().references('Curriculum.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('StudentCycle_cycleId_studentId_unique')
    .unique()
    .on('StudentCycle')
    .columns(['cycleId', 'studentId'])
    .execute()

  await db.schema
    .createIndex('StudentCycle_studentId_index')
    .on('StudentCycle')
    .column('studentId')
    .execute()
  await db.schema
    .createIndex('StudentCycle_cycleId_index')
    .on('StudentCycle')
    .column('cycleId')
    .execute()
  await db.schema
    .createIndex('StudentCycle_curriculumId_index')
    .on('StudentCycle')
    .column('curriculumId')
    .execute()

  // ResetPasswordToken
  await db.schema
    .createTable('ResetPasswordToken')
    .addColumn('token', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('userId', 'uuid', (col) =>
      col.notNull().references('User.id').onDelete('cascade')
    )
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('ResetPasswordToken_userId_index')
    .on('ResetPasswordToken')
    .column('userId')
    .execute()

  // Question
  await db.schema
    .createTable('Question')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('number', 'integer', (col) => col.notNull())
    .addColumn('pageNumber', 'integer', (col) => col.notNull())
    .addColumn('partNumber', 'integer', (col) => col.notNull())
    .addColumn('hadithNumber', 'integer', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('style', 'varchar(100)', (col) => col.notNull())
    .addColumn('difficulty', 'varchar(100)', (col) => col.notNull())
    .addColumn('text', 'text', (col) => col.notNull())
    .addColumn('textForTrue', 'text')
    .addColumn('textForFalse', 'text')
    .addColumn('option1', 'text')
    .addColumn('option2', 'text')
    .addColumn('option3', 'text')
    .addColumn('option4', 'text')
    .addColumn('answer', 'text', (col) => col.notNull())
    .addColumn('anotherAnswer', 'text', (col) => col.notNull())
    .addColumn('isInsideShaded', 'boolean', (col) => col.notNull())
    .addColumn('objective', 'text', (col) => col.notNull())
    .addColumn('courseId', 'uuid', (col) =>
      col.notNull().references('Course.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Question_partNumber_index')
    .on('Question')
    .column('partNumber')
    .execute()
  await db.schema
    .createIndex('Question_hadithNumber_index')
    .on('Question')
    .column('hadithNumber')
    .execute()
  await db.schema
    .createIndex('Question_difficulty_index')
    .on('Question')
    .column('difficulty')
    .execute()
  await db.schema
    .createIndex('Question_type_index')
    .on('Question')
    .column('type')
    .execute()
  await db.schema
    .createIndex('Question_style_index')
    .on('Question')
    .column('style')
    .execute()
  await db.schema
    .createIndex('Question_courseId_index')
    .on('Question')
    .column('courseId')
    .execute()

  // SystemExam
  await db.schema
    .createTable('SystemExam')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('endsAt', 'timestamptz')
    .addColumn('repeatFromSameHadith', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('curriculumId', 'uuid', (col) =>
      col.notNull().references('Curriculum.id').onDelete('cascade')
    )
    .addColumn('cycleId', 'uuid', (col) =>
      col.notNull().references('Cycle.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('SystemExam_type_index')
    .on('SystemExam')
    .column('type')
    .execute()
  await db.schema
    .createIndex('SystemExam_curriculumId_index')
    .on('SystemExam')
    .column('curriculumId')
    .execute()
  await db.schema
    .createIndex('SystemExam_cycleId_index')
    .on('SystemExam')
    .column('cycleId')
    .execute()

  // Model
  await db.schema
    .createTable('Model')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('systemExamId', 'uuid', (col) =>
      col.references('SystemExam.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Model_systemExamId_index')
    .on('Model')
    .column('systemExamId')
    .execute()

  // ModelQuestion
  await db.schema
    .createTable('ModelQuestion')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('modelId', 'uuid', (col) =>
      col.notNull().references('Model.id').onDelete('cascade')
    )
    .addColumn('questionId', 'uuid', (col) =>
      col.notNull().references('Question.id').onDelete('cascade')
    )
    .addColumn('weight', 'integer', (col) => col.notNull())
    .addColumn('order', 'integer', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('ModelQuestion_modelId_index')
    .on('ModelQuestion')
    .column('modelId')
    .execute()
  await db.schema
    .createIndex('ModelQuestion_questionId_index')
    .on('ModelQuestion')
    .column('questionId')
    .execute()

  // Quiz
  await db.schema
    .createTable('Quiz')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('grade', 'integer')
    .addColumn('percentage', 'real')
    .addColumn('total', 'integer')
    .addColumn('questionsCreated', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('enteredAt', 'timestamptz')
    .addColumn('submittedAt', 'timestamptz')
    .addColumn('correctedAt', 'timestamptz')
    .addColumn('endsAt', 'timestamptz')
    .addColumn('curriculumId', 'uuid', (col) =>
      col.notNull().references('Curriculum.id').onDelete('cascade')
    )
    .addColumn('examineeId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade')
    )
    .addColumn('correctorId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade')
    )
    .addColumn('systemExamId', 'uuid', (col) =>
      col.references('SystemExam.id').onDelete('cascade')
    )
    .addColumn('modelId', 'uuid', (col) =>
      col.notNull().references('Model.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('Quiz_grade_index')
    .on('Quiz')
    .column('grade')
    .execute()
  await db.schema
    .createIndex('Quiz_type_index')
    .on('Quiz')
    .column('type')
    .execute()
  await db.schema
    .createIndex('Quiz_examineeId_index')
    .on('Quiz')
    .column('examineeId')
    .execute()
  await db.schema
    .createIndex('Quiz_correctorId_index')
    .on('Quiz')
    .column('correctorId')
    .execute()
  await db.schema
    .createIndex('Quiz_curriculumId_index')
    .on('Quiz')
    .column('curriculumId')
    .execute()
  await db.schema
    .createIndex('Quiz_systemExamId_index')
    .on('Quiz')
    .column('systemExamId')
    .execute()
  await db.schema
    .createIndex('Quiz_modelId_index')
    .on('Quiz')
    .column('modelId')
    .execute()

  // QuestionsGroup
  await db.schema
    .createTable('QuestionsGroup')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('order', 'integer', (col) => col.notNull())
    .addColumn('questionsNumber', 'integer')
    .addColumn('gradePerQuestion', 'integer')
    .addColumn('difficulty', 'varchar(100)')
    .addColumn('styleOrType', 'varchar(100)')
    .addColumn('systemExamId', 'uuid', (col) =>
      col.notNull().references('SystemExam.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('QuestionsGroup_order_index')
    .on('QuestionsGroup')
    .column('order')
    .execute()
  await db.schema
    .createIndex('QuestionsGroup_systemExamId_index')
    .on('QuestionsGroup')
    .column('systemExamId')
    .execute()

  // QuizQuestion
  await db.schema
    .createTable('QuizQuestion')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('answer', 'text')
    .addColumn('order', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('grade', 'integer')
    .addColumn('weight', 'integer', (col) => col.notNull())
    .addColumn('questionId', 'uuid', (col) =>
      col.notNull().references('Question.id').onDelete('cascade')
    )
    .addColumn('quizId', 'uuid', (col) =>
      col.notNull().references('Quiz.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('QuizQuestion_questionId_index')
    .on('QuizQuestion')
    .column('questionId')
    .execute()
  await db.schema
    .createIndex('QuizQuestion_quizId_index')
    .on('QuizQuestion')
    .column('quizId')
    .execute()

  // CourseCorrector
  await db.schema
    .createTable('CourseCorrector')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('courseId', 'uuid', (col) =>
      col.notNull().references('Course.id').onDelete('cascade')
    )
    .addColumn('correctorId', 'uuid', (col) =>
      col.notNull().references('Corrector.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('CourseCorrector_courseId_index')
    .on('CourseCorrector')
    .column('courseId')
    .execute()
  await db.schema
    .createIndex('CourseCorrector_correctorId_index')
    .on('CourseCorrector')
    .column('correctorId')
    .execute()

  // CycleCourse
  await db.schema
    .createTable('CycleCourse')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('courseId', 'uuid', (col) =>
      col.notNull().references('Course.id').onDelete('cascade')
    )
    .addColumn('cycleId', 'uuid', (col) =>
      col.notNull().references('Cycle.id').onDelete('cascade')
    )
    .execute()

  await db.schema
    .createIndex('CycleCourse_courseId_index')
    .on('CycleCourse')
    .column('courseId')
    .execute()

  await db.schema
    .createIndex('CycleCourse_cycleId_index')
    .on('CycleCourse')
    .column('cycleId')
    .execute()

  // ErrorReport
  await db.schema
    .createTable('ErrorReport')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('note', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('questionId', 'uuid', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('ErrorReport_questionId_index')
    .on('ErrorReport')
    .column('questionId')
    .execute()
  await db.schema
    .createIndex('ErrorReport_createdAt_index')
    .on('ErrorReport')
    .column('createdAt')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Application
  await db.schema.dropTable('ErrorReport').ifExists().execute()
  await db.schema.dropTable('CycleCourse').ifExists().execute()
  await db.schema.dropTable('CourseCorrector').ifExists().execute()
  await db.schema.dropTable('QuizQuestion').ifExists().execute()
  await db.schema.dropTable('QuestionsGroup').ifExists().execute()
  await db.schema.dropTable('Quiz').ifExists().execute()
  await db.schema.dropTable('ModelQuestion').ifExists().execute()
  await db.schema.dropTable('Model').ifExists().execute()
  await db.schema.dropTable('SystemExam').ifExists().execute()
  await db.schema.dropTable('Question').ifExists().execute()
  await db.schema.dropTable('ResetPasswordToken').ifExists().execute()
  await db.schema.dropTable('StudentCycle').ifExists().execute()
  await db.schema.dropTable('Corrector').ifExists().execute()
  await db.schema.dropTable('Student').ifExists().execute()
  await db.schema.dropTable('CurriculumPart').ifExists().execute()
  await db.schema.dropTable('Curriculum').ifExists().execute()
  await db.schema.dropTable('Track').ifExists().execute()
  await db.schema.dropTable('Course').ifExists().execute()
  await db.schema.dropTable('Cycle').ifExists().execute()

  // Next-auth
  await db.schema.dropTable('Account').ifExists().execute()
  await db.schema.dropTable('Session').ifExists().execute()
  await db.schema.dropTable('User').ifExists().execute()
  await db.schema.dropTable('VerificationToken').ifExists().execute()
}
