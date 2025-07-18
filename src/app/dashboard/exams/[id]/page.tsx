import { api } from '~/trpc/server'
import { Badge } from '~/components/ui/badge'
import { formatDate } from '~/utils/formatDate'
import { enTypeToAr } from '~/utils/exams'
import { db } from '~/server/db'
import { CircularProgress } from '~/components/ui/circular-progress'
import { ExamTable } from './_components/table'
import { sql } from 'kysely'
import { SubmissionChart } from './_components/submission-chart'
import { notFound } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'
import { whereCanReadExam } from '~/services/exam'
import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'

export const metadata = {
  title: 'إختبارات النظام',
}

type Params = { id: string }

type SearchParams = {
  page?: string
}

const ExamsPage = async ({
  params: { id },
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) => {
  const session = await getServerAuthSession()
  if (session?.user.role === 'STUDENT') notFound()

  const systemExam = await db
    .selectFrom('SystemExam')
    .where('SystemExam.id', '=', id)
    .where(whereCanReadExam(session!))
    .leftJoin('Cycle', 'SystemExam.cycleId', 'Cycle.id')
    .leftJoin('Curriculum', 'SystemExam.curriculumId', 'Curriculum.id')
    .leftJoin('Track', 'Curriculum.trackId', 'Track.id')
    .leftJoin('Course', 'Track.courseId', 'Course.id')
    .selectAll('SystemExam')
    .select([
      'Course.name as courseName',
      'Curriculum.name as curriculumName',
      'Cycle.name as cycleName',
    ])
    .executeTakeFirst()

  if (!systemExam) notFound()

  const quizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .executeTakeFirst()
    )?.total,
  )

  const submittedQuizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .where('submittedAt', 'is not', null)
        .executeTakeFirst()
    )?.total,
  )

  const submittedQuizPercentage = (submittedQuizCount / quizCount) * 100

  const correctedQuizCount = Number(
    (
      await db
        .selectFrom('Quiz')
        .select(({ fn }) => [fn.count('id').as('total')])
        .where('systemExamId', '=', id)
        .where('correctorId', 'is not', null)
        .executeTakeFirst()
    )?.total,
  )

  const avgStats = await db
    .selectFrom('Quiz')
    .select(({ fn }) => [
      fn.avg('grade').as('gradeAvg'),
      fn.avg('percentage').as('percentageAvg'),
    ])
    .where('systemExamId', '=', id)
    .where('correctedAt', 'is not', null)
    .executeTakeFirstOrThrow()

  const submissionsDates = await db
    .selectFrom('Quiz')
    .select(({ fn }) => [
      fn.count<string>('id').as('total'),
      sql`CAST(${sql.ref('submittedAt')} AS DATE)`.as('submittedAt'),
    ])
    .where('systemExamId', '=', id)
    .where('submittedAt', 'is not', null)
    .groupBy(sql`CAST(${sql.ref('submittedAt')} AS DATE)`)
    .$narrowType<{ submittedAt: Date }>()
    .execute()

  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)

  const quizzes = await api.quiz.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: { systemExamId: id },
    include: { examinee: true, corrector: true, model: true },
  })

  return (
    <div>
      <div className='mb-4 flex items-center gap-2'>
        <h2 className='text-2xl font-bold'>إختبارات النظام</h2>
        <Link href={`/dashboard/exams/${id}/add-student`} className={buttonVariants()}>
        إضافة طالب
        </Link>
      </div>
      <div className='mb-4 rounded-md bg-white p-4 border'>
        <p>
          اسم الإختبار: <strong>{systemExam.name}</strong>
        </p>
        <p>نوع الإختبار: {enTypeToAr(systemExam.type)}</p>
        <p>الدورة: {systemExam.cycleName}</p>
        <p>المقرر: {systemExam.courseName}</p>
        <p>المنهج: {systemExam.curriculumName}</p>
        <p>وقت إنشاء الإختبار: {formatDate(systemExam.createdAt)}</p>
        <div>
          <span>وقت غلق الإختبار:</span>{' '}
          {systemExam.endsAt ? formatDate(systemExam.endsAt) : 'لا يوجد'}{' '}
          {!systemExam.endsAt || systemExam.endsAt > new Date() ? (
            <Badge>مفتوح</Badge>
          ) : (
            <Badge variant='destructive'>مغلق</Badge>
          )}
        </div>
      </div>
      <div className='mb-4 rounded-md bg-white p-4 border'>
        <div className='flex items-center justify-around'>
          <div className='flex flex-col items-center justify-center'>
            <CircularProgress percent={submittedQuizPercentage} />
            <p>نسبة المختبرين</p>
          </div>
          {avgStats.percentageAvg === null ? (
            <p>لم يتم حساب متوسط الدرجات</p>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <CircularProgress percent={Number(avgStats.percentageAvg)} />
              <p>متوسط الدرجات (نسبة)</p>
            </div>
          )}
        </div>
        <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 border'>
            <p className='text-xl font-semibold'>{quizCount}</p>
            <p>المستحقين للإختبار</p>
          </div>
          <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 border'>
            <p className='text-xl font-semibold'>{submittedQuizCount}</p>
            <p>الذين دخلوا الإختبار</p>
          </div>
          <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 border'>
            <p className='text-xl font-semibold'>{correctedQuizCount}</p>
            <p>ما تم تصحيحه</p>
          </div>
          {/* <div className='flex flex-col items-center justify-center rounded-md bg-muted p-4 border'>
            <p className='text-xl font-semibold'>
              {avgStats.gradeAvg === null
                ? 'لم يتم حسابها'
                : `${Number(avgStats.gradeAvg).toFixed(2)}/${
                    quizzes.data?.[0]?.total
                  }`}
            </p>
            <p>متوسط الدرجات</p>
          </div> */}
        </div>

        {submissionsDates.length > 0 && (
          <div className='mt-4'>
            <div dir='ltr'>
              <SubmissionChart data={submissionsDates} />
              <p className='text-center'>عدد عمليات التسليم بتواريخهم</p>
            </div>
          </div>
        )}
      </div>
      <div className='p-4 rounded-md border bg-white'>
        <ExamTable initialData={quizzes} systemExam={systemExam} />
      </div>
    </div>
  )
}

export default ExamsPage
