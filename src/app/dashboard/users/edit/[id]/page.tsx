import { api } from '~/trpc/server'
import { EditUserForm } from '../../_components/edit-form'
import { notFound } from 'next/navigation'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const user = await api.user.get({ id: params.id })

  return {
    title: `تعديل مستخدم ${user?.name} | ${siteName}`,
  }
}

export default async function EditCurriculumPage({
  params,
}: {
  params: Params
}) {
  const user = await api.user.get({
    id: params.id,
    include: {
      cycles: { curriculum: { track: { course: true } }, cycle: true },
    },
  })
  const cycles = await api.cycle.list()

  if (!user) return notFound()

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>تعديل بيانات مستخدم</h2>
      <div className='rounded-lg bg-gray-100 p-4'>
        <EditUserForm user={user} cycles={cycles.data} />
      </div>
    </div>
  )
}
