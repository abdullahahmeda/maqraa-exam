import { api } from '~/trpc/server'
import { EditQuestionStyleForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'
import { ChoiceColumn } from '../../_components/form-fields'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const questionStyle = await api.questionStyle.get({ id: params.id })

  return {
    title: `تعديل نوع سؤال ${questionStyle?.name} | ${siteName}`,
  }
}

export default async function EditQuestionStylePage({
  params,
}: {
  params: Params
}) {
  const questionStyle = await api.questionStyle.get({ id: params.id })

  if (!questionStyle) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل نوع سؤال</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditQuestionStyleForm
          questionStyle={{
            ...questionStyle,
            choicesColumns:
              questionStyle.type === 'WRITTEN'
                ? undefined
                : (questionStyle.choicesColumns as ChoiceColumn[]),
          }}
        />
      </div>
    </div>
  )
}
