import { api, HydrateClient } from '~/trpc/server'
import { CyclesTable } from './_components/table'
import { AddCycleButton } from './_components/add-cycle-button'
import { DeleteModalProvider } from './_components/delete-modal'
import { EditModalProvider } from './_components/edit-modal'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الدورات | ${siteName}`,
  }
}

export default async function CyclesPage(props: {
  searchParams: Promise<{ page?: string }>
}) {
  const searchParams = await props.searchParams
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  await api.cycle.getTableList.prefetch({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    filters: {},
  })

  return (
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الدورات</h2>
        <AddCycleButton />
      </div>
      <EditModalProvider>
        <DeleteModalProvider>
          <CyclesTable />
        </DeleteModalProvider>
      </EditModalProvider>
    </HydrateClient>
  )
}
