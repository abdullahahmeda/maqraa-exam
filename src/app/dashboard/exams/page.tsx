import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { ExamsTable } from './_components/table'
import { StudentQuizzesTable } from './_components/student-table'
import { getServerAuthSession } from '~/server/auth'

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
  const session = await getServerAuthSession()

  if (session?.user.role === 'STUDENT') {
    const exams = await api.quiz.list({
      pagination: {
        pageIndex,
        pageSize: 50,
      },
      filters: { systemExamId: 'not_null' },
      include: { examinee: true, corrector: true, systemExam: true },
    })

    return (
      <>
        <div className='mb-4 flex items-center'>
          <h2 className='ml-4 text-2xl font-bold'>إختبارات النظام</h2>
        </div>
        <StudentQuizzesTable initialData={exams} />
      </>
    )
  }

  const exams = await api.exam.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    include: { curriculum: { track: { course: true } }, cycle: true },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الإختبارات</h2>
        <Link className={buttonVariants()} href='/dashboard/exams/new' prefetch>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة إختبار
        </Link>
      </div>
      <ExamsTable initialData={exams} />
    </>
  )
}
