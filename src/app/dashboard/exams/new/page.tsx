import { api } from '~/trpc/server'
import { NewExamForm } from '../_components/new-form'
import { getServerAuthSession } from '~/server/auth'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة إختبار | ${siteName}`,
  }
}

export default async function NewExamPage() {
  const cycles = await api.cycle.list()
  const courses = await api.course.list()

  const session = await getServerAuthSession()
  if (!session?.user.role.includes('ADMIN')) notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة إختبار</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewExamForm cycles={cycles.data} courses={courses.data} />
      </div>
    </div>
  )
}
