import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/trpc/server'
import Link from 'next/link'
import { QuestionStylesTable } from './_components/table'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `أنواع الأسئلة | ${siteName}`,
  }
}

export default async function QuestionStylesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  const questionStyles = await api.questionStyle.list({
    pagination: {
      pageIndex,
      pageSize: 50,
    },
  })

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>أنواع الأسئلة</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/questions/styles/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة نوع سؤال
        </Link>
      </div>
      <QuestionStylesTable initialData={questionStyles} />
    </>
  )
}
