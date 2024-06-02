import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { CyclesTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الدورات | ${siteName}`,
  }
}

export default async function CyclesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const cycles = await api.cycle.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
    include: { cycleCurricula: { curriculum: true } },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الدورات</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/cycles/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة دورة
        </Link>
      </div>
      <CyclesTable initialData={cycles} />
    </>
  )
}
