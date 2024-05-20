import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { CurriculaTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المناهج | ${siteName}`,
  }
}

export default async function CurriculaPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const curricula = await api.curriculum.list({
    pagination: { pageIndex, pageSize: 50 },
    include: { track: { course: true } },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المناهج</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/curricula/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة منهج
        </Link>
      </div>
      <CurriculaTable initialData={curricula} />
    </>
  )
}
