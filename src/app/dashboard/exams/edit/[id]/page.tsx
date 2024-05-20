import { api } from '~/trpc/server'
import { EditExamForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = {
  id: string
}

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()
  const exam = await api.exam.get({ id: params.id })

  return {
    title: `تعديل إختبار ${exam?.name} | ${siteName}`,
  }
}

export default async function EditCoursePage({ params }: { params: Params }) {
  const exam = await api.exam.get({ id: params.id })

  if (!exam) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل إختبار</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditExamForm exam={exam} />
      </div>
    </div>
  )
}
