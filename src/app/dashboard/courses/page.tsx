import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { CoursesTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المقررات | ${siteName}`,
  }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const courses = await api.course.getTableList({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المقررات</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/courses/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة مقرر
        </Link>
      </div>
      <CoursesTable initialData={courses} />
    </>
  )
}
