import { api } from '~/trpc/server'
import { EditCurriculumForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const curriculum = await api.curriculum.getEdit({ id: params.id })

  return {
    title: `تعديل منهج ${curriculum?.name} | ${siteName}`,
  }
}

export default async function EditCurriculumPage({
  params,
}: {
  params: Params
}) {
  const curriculum = await api.curriculum.getEdit({
    id: params.id,
    include: { parts: true },
  })
  const tracks = await api.track.list({
    include: { course: true },
  })

  if (!curriculum) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل منهج</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditCurriculumForm curriculum={curriculum} tracks={tracks.data} />
      </div>
    </div>
  )
}
