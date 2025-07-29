import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
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

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const users = await api.user.getTableList({
    pagination: { pageIndex, pageSize: 50 },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المستخدمين</h2>
        <Link className={buttonVariants()} href='/dashboard/users/new' prefetch>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة
        </Link>
      </div>
      <DeleteModalProvider>
        <ViewModalProvider>
          <UsersTable initialData={users} />
        </ViewModalProvider>
      </DeleteModalProvider>
    </>
  )
}
