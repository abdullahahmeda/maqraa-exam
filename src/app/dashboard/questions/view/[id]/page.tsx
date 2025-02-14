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
  const question = await api.question.getShow({ id: params.id })

  if (!question) return notFound()

  return <div className='p-4 rounded-lg bg-white border'><ViewOne question={question} /></div>
}

export default QuestionPage
