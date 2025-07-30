import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api, HydrateClient } from '~/trpc/server'
import Link from 'next/link'
import { UsersTable } from './_components/table'
import { ViewModalProvider } from './_components/view-modal'
import { DeleteModalProvider } from './_components/delete-modal'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المستخدمين | ${siteName}`,
  }
}

export default async function UsersPage(
  props: {
    searchParams: Promise<{ page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  await api.user.getTableList.prefetch({
    pagination: { pageIndex, pageSize: 50 }, filters: {}
  })

  return (
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المستخدمين</h2>
        <Link className={buttonVariants()} href='/dashboard/users/new' prefetch>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة
        </Link>
      </div>
      <DeleteModalProvider>
        <ViewModalProvider>
          <UsersTable />
        </ViewModalProvider>
      </DeleteModalProvider>
    </HydrateClient>
  )
}
