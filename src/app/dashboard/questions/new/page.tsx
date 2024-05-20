import { api } from '~/trpc/server'
import { ImportQuestionsForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة أسئلة | ${siteName}`,
  }
}

export default async function NewQuestionPage() {
  const courses = await api.course.list()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة أسئلة</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <ImportQuestionsForm courses={courses.data} />
      </div>
    </div>
  )
}
