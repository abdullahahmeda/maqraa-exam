import { MailIcon } from 'lucide-react'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `تحقق من البريد الإلكتروني | ${siteName}`,
  }
}

const VerifyRequestPage = () => {
  return (
    <div className='container mx-auto py-4'>
      <div className='mx-auto max-w-md rounded-md bg-green-600 p-4 text-center text-white border'>
        <MailIcon size={80} className='mx-auto mb-3' />
        <h1 className='text-2xl'>تحقق من البريد الإلكتروني</h1>
        <p className='text-slate-100'>
          تم ارسال رابط لتسجيل الدخول إلى بريدك الإلكتروني.
        </p>
      </div>
    </div>
  )
}

export default VerifyRequestPage
