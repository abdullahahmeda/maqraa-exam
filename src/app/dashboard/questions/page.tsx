import { buttonVariants } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api, HydrateClient } from '~/trpc/server'
import Link from 'next/link'
import { QuestionsTable } from './_components/table'
import { type Selectable } from 'kysely'
import type { QuestionStyle } from '~/kysely/types'
import { getQuestionList } from '~/services/question'
import { ViewModalProvider } from './_components/view-modal'
import { DeleteModalProvider } from './_components/delete-modal'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `الأسئلة | ${siteName}`,
  }
}

export default async function QuestionsPage(
  props: {
    searchParams: Promise<{ page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const pageIndex = Math.max((Number(searchParams.page) || 1) - 1, 0)
  await api.question.getTableList.prefetch({ 
    pagination: { pageIndex, pageSize: 50, }, filters: {}
  })

  const styles = await api.questionStyle.list(undefined)

  const questionStyles = styles.data.reduce(
    (acc, s) => ({ ...acc, [s.id]: s }),
    {},
  ) as Record<string, Selectable<QuestionStyle>>
  return (
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>الأسئلة</h2>
        <Link
          className={buttonVariants()}
          href='/dashboard/questions/new'
          prefetch
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة أسئلة
        </Link>
      </div>
      <DeleteModalProvider>
      <ViewModalProvider>
      <QuestionsTable questionStyles={questionStyles} />
      </ViewModalProvider>
      </DeleteModalProvider>
    </HydrateClient>
  )
}
