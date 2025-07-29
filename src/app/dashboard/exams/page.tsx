import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { ExamsTable } from './_components/table'
import { StudentQuizzesTable } from './_components/student-table'
import { getServerAuthSession } from '~/server/auth'
import { getExamList } from '~/services/exam'
import { DeleteModalProvider } from './_components/delete-modal'
import { getQuizList } from '~/services/quiz'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الإختبارات | ${siteName}`,
  }
}

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const session = (await getServerAuthSession())!

  if (session.user.role === 'STUDENT') {
    const exams = await getQuizList({
      user: session.user,
      pagination: {
        pageIndex,
        pageSize: 50,
      },
      filters: { systemExamId: 'not_null' },
    }, 'student-table')

    return (
      <>
        <div className='mb-4 flex items-center'>
          <h2 className='ml-4 text-2xl font-bold'>إختبارات النظام</h2>
        </div>
        <StudentQuizzesTable initialData={exams} />
      </>
    )
  }

  const exams = await getExamList({
    user: session.user,
    pagination: {
      pageIndex,
      pageSize: 50,
    },
  }, 'table')

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الإختبارات</h2>
        <Link className={buttonVariants()} href='/dashboard/exams/new' prefetch>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة إختبار
        </Link>
      </div>
      <DeleteModalProvider>
        <ExamsTable initialData={exams} />
      </DeleteModalProvider>
    </>
  )
}
