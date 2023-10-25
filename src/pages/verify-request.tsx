import Head from 'next/head'
import { Mail } from 'lucide-react'
import WebsiteLayout from '../components/layout'

const VerifyRequestPage = () => {
  return (
    <>
      <Head>
        <title>تحقق من البريد الإلكتروني</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto max-w-md rounded-md bg-green-600 p-4 text-center text-white shadow'>
          <Mail size={80} className='mx-auto mb-3' />
          <h1 className='text-2xl'>تحقق من البريد الإلكتروني</h1>
          <p className='text-slate-100'>
            تم ارسال رابط لتسجيل الدخول إلى بريدك الإلكتروني.
          </p>
        </div>
      </div>
    </>
  )
}

VerifyRequestPage.getLayout = (page: any) => (
  <WebsiteLayout>{page}</WebsiteLayout>
)
export default VerifyRequestPage
