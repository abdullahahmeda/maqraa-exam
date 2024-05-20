import { AlertTriangleIcon } from 'lucide-react'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `هذه الصفحة غير موجودة | ${siteName}`,
  }
}

const NotFoundPage = () => {
  return (
    <div className='container mx-auto py-4'>
      <div className='mx-auto flex max-w-md flex-col items-center gap-2 rounded-md bg-white p-4 border'>
        <AlertTriangleIcon className='h-10 w-10 text-red-600' />
        <h1 className='text-xl font-bold'>هذه الصفحة غير موجودة</h1>
      </div>
    </div>
  )
}

export default NotFoundPage
