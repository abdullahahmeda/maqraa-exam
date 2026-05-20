import { api } from '~/trpc/server'
import { EditCourseForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const course = await api.course.getEdit({ id: params.id })

  return {
    title: `تعديل مقرر ${course?.name} | ${siteName}`,
  }
}

export default async function EditCoursePage({ params }: { params: Params }) {
  const course = await api.course.getEdit({ id: params.id })

  if (!course) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل مقرر</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditCourseForm course={course} />
      </div>
    </div>
  )
}
