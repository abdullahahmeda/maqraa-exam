import { api, HydrateClient } from '~/trpc/server'
import { ErrorReportsTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `البلاغات | ${siteName}`,
  }
}

export default async function ErrorReportsPage(
  props: {
    searchParams: Promise<{ page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  await api.errorReport.list.prefetch({
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
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>البلاغات</h2>
      </div>
      <ErrorReportsTable />
    </HydrateClient>
  )
}
