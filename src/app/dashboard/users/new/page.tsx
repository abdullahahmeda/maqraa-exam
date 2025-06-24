import { api } from '~/trpc/server'
import { NewUserForm } from '../_components/new-form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة مستخدمين | ${siteName}`,
  }
}

export default async function NewUserPage() {
  const cycles = await api.cycle.getList()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>إضافة مستخدم</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <NewUserForm cycles={cycles} />
      </div>
    </div>
  )
}
