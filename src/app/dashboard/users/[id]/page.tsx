import { notFound } from 'next/navigation'
import { ViewOne } from '../_components/view-one'
import { api } from '~/trpc/server'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const siteName = await api.setting.getSiteName()
  const user = await api.user.get({ id: params.id })

  return {
    title: `عرض مستخدم ${user?.name} | ${siteName}`,
  }
}

export default async function UserPage({ params }: { params: Params }) {
  const user = await api.user.get({ id: params.id })

  if (!user) return notFound()

  return (
    <div>
      <ViewOne user={user} />
    </div>
  )
}
