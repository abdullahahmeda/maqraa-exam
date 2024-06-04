import { api } from '~/trpc/server'
import { QuizzesTable } from './_components/table'
import { getServerAuthSession } from '~/server/auth'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الإختبارات التجريبية | ${siteName}`,
  }
}

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const session = await getServerAuthSession()
  if (session?.user.role !== 'STUDENT') notFound()

  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const exams = await api.quiz.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: { systemExamId: null },
    include: { examinee: true, corrector: true },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الإختبارات التجريبية</h2>
      </div>
      <QuizzesTable initialData={exams} />
    </>
  )
}
