import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { TracksTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المسارات | ${siteName}`,
  }
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const tracks = await api.track.list({
    pagination: { pageIndex, pageSize: 50 },
    include: { course: true },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المسارات</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/tracks/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة مسار
        </Link>
      </div>
      <TracksTable initialData={tracks} />
    </>
  )
}
