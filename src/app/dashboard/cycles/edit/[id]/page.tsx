import { api } from '~/trpc/server'
import { EditCycleForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = {
  id: string
}

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const cycle = await api.cycle.get({ id: params.id })

  return {
    title: `تعديل دورة ${cycle?.name} | ${siteName}`,
  }
}

export default async function EditCyclePage({ params }: { params: Params }) {
  const cycle = await api.cycle.get({ id: params.id })

  if (!cycle) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل دورة</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditCycleForm cycle={cycle} />
      </div>
    </div>
  )
}
