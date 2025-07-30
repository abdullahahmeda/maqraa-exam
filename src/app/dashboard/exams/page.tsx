import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api, HydrateClient } from '~/trpc/server'
import Link from 'next/link'
import { ExamsTable } from './_components/table'
import { StudentQuizzesTable } from './_components/student-table'
import { getServerAuthSession } from '~/server/auth'
import { DeleteModalProvider } from './_components/delete-modal'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الإختبارات | ${siteName}`,
  }
}

export default async function ExamsPage(
  props: {
    searchParams: Promise<{ page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const session = (await getServerAuthSession())!

  if (session.user.role === 'STUDENT') {
     await api.quiz.getTableListForStudent.prefetch({
      pagination: {
        pageIndex,
        pageSize: 50,
      },
      filters: { systemExamId: 'not_null' },
    })

    return (
      <HydrateClient>
        <div className='mb-4 flex items-center'>
          <h2 className='ml-4 text-2xl font-bold'>إختبارات النظام</h2>
        </div>
        <StudentQuizzesTable />
      </HydrateClient>
    )
  }

  await api.exam.getTableList.prefetch({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: {}
  })

  return (
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الإختبارات</h2>
        <Link className={buttonVariants()} href='/dashboard/exams/new' prefetch>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة إختبار
        </Link>
      </div>
      <DeleteModalProvider>
        <ExamsTable />
      </DeleteModalProvider>
    </HydrateClient>
  )
}
