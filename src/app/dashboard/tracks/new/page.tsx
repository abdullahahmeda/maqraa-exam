import { api } from '~/trpc/server'
import { NewTrackForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة مسار | ${siteName}`,
  }
}

export default async function NewTrackPage() {
  const courses = await api.course.list()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة مسار</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewTrackForm courses={courses.data} />
      </div>
    </div>
  )
}
