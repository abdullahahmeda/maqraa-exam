import { api } from '~/trpc/server'
import { ErrorReportsTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `البلاغات | ${siteName}`,
  }
}

export default async function ErrorReportsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const errorReports = await api.errorReport.list({
    include: {
      user: true,
      modelQuestion: {
        question: true,
      },
    },
    pagination: {
      pageIndex,
      pageSize: 50,
    },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>البلاغات</h2>
      </div>
      <ErrorReportsTable initialData={errorReports} />
    </>
  )
}
