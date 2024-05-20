import { api } from '~/trpc/server'
import { ExamsTable } from './_components/table'

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
  const exams = await api.quiz.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: { systemExamId: null },
    include: { examinee: true, corrector: true, systemExam: true },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الإختبارات</h2>
      </div>
      <ExamsTable initialData={exams} />
    </>
  )
}
