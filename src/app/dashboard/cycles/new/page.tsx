import { api } from '~/trpc/server'
import { NewCycleForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة دورة | ${siteName}`,
  }
}

export default async function NewCyclePage() {
  const curricula = await api.curriculum.list()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة دورة</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewCycleForm curricula={curricula.data} />
      </div>
    </div>
  )
}
