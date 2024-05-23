import { api } from '~/trpc/server'
import { ViewOne } from '../../_components/view-one'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `عرض سؤال | ${siteName}`,
  }
}

const QuestionPage = async ({ params }: { params: { id: string } }) => {
  const question = await api.question.get({
    id: params.id,
    include: { course: true, style: true },
  })

  if (!question) return notFound()

  return <ViewOne question={question} />
}

export default QuestionPage
