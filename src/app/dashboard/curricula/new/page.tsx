import { api } from '~/trpc/server'
import { NewCurriculumForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة منهج | ${siteName}`,
  }
}

export default async function NewCurriculumPage() {
  const tracks = await api.track.list({
    include: { course: true },
  })

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة منهج</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewCurriculumForm tracks={tracks.data} />
      </div>
    </div>
  )
}
