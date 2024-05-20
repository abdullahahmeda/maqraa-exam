import { api } from '~/trpc/server'
import { NewQuestionStyleForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة نوع سؤال | ${siteName}`,
  }
}

export default function NewQuestionStylePage() {
  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة نوع سؤال</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewQuestionStyleForm />
      </div>
    </div>
  )
}
