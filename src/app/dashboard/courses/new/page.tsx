import { api } from '~/trpc/server'
import { NewCourseForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة مقرر | ${siteName}`,
  }
}

export default function NewCoursePage() {
  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة مقرر</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewCourseForm />
      </div>
    </div>
  )
}
