import { api } from '~/trpc/server'
import { EditTrackForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const track = await api.track.get({ id: params.id })

  return {
    title: `تعديل مسار ${track?.name} | ${siteName}`,
  }
}

export default async function EditTrackPage({ params }: { params: Params }) {
  const track = await api.track.get({ id: params.id })
  const courses = await api.course.list()

  if (!track) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل مسار</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditTrackForm track={track} courses={courses.data} />
      </div>
    </div>
  )
}
