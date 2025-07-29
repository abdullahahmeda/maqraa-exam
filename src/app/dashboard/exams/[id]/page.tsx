import { api } from '~/trpc/server'
import { Badge } from '~/components/ui/badge'
import { formatDate } from '~/utils/formatDate'
import { enTypeToAr } from '~/utils/exams'
import { CircularProgress } from '~/components/ui/circular-progress'
import { ExamTable } from './_components/table'
import { SubmissionChart } from './_components/submission-chart'
import { notFound } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'
import { getExam, getExamStats } from '~/services/exam'
import { Button } from '~/components/ui/button'
import { Dialog, DialogTrigger } from '~/components/ui/dialog'
import { AddStudentModal } from './_components/add-student-modal'
import { DeleteModalProvider } from './_components/delete-modal'
import { getQuizList } from '~/services/quiz'

export const metadata = {
  title: 'إختبارات النظام',
}

type Params = { id: string }

type SearchParams = {
  page?: string
}

const ExamsPage = async (
  props: {
    params: Promise<Params>
    searchParams: Promise<SearchParams>
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    id
  } = params;

  const session = (await getServerAuthSession())!
  if (session.user.role === 'STUDENT') notFound()

  const systemExam = await getExam({ id, user: session.user }, 'show')
  if (!systemExam) notFound()

  const {
    quizCount,
    submittedQuizCount,
    correctedQuizCount,
    avgStats,
    submissionsDates,
  } = await getExamStats({ id })

  const submittedQuizPercentage = (submittedQuizCount / quizCount) * 100

  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)

  const quizzes = await getQuizList({
    user: session.user,
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: { systemExamId: id },
  }, 'exam-table')

  return (
    <div>
      <div className='mb-4 flex items-center gap-2'>
        <h2 className='text-2xl font-bold'>إختبارات النظام</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>إضافة طالب</Button>
          </DialogTrigger>
          <AddStudentModal />
        </Dialog>
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
        <DeleteModalProvider>
          <ExamTable initialData={quizzes} systemExam={systemExam} />
        </DeleteModalProvider>
      </div>
    </div>
  )
}

export default ExamsPage
