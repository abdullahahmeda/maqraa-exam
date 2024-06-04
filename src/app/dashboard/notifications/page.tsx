import { api } from '~/trpc/server'
import { CreateNotificationForm } from './_components/form'
import { getServerAuthSession } from '~/server/auth'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة إشعار | ${siteName}`,
  }
}

const CreateNotificationPage = async () => {
  const session = await getServerAuthSession()
  if (session?.user.role !== 'ADMIN') notFound()

  return (
    <div>
      <h2 className='text-2xl font-bold'>إضافة إشعار</h2>
      <CreateNotificationForm />
    </div>
  )
}

export default CreateNotificationPage
