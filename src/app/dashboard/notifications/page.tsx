import { api } from '~/trpc/server'
import { CreateNotificationForm } from './_components/form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إضافة إشعار | ${siteName}`,
  }
}

const CreateNotificationPage = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold'>إضافة إشعار</h2>
      <CreateNotificationForm />
    </div>
  )
}

export default CreateNotificationPage
