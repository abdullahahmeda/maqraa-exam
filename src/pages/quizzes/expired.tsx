import Head from 'next/head'
import { AlertCircle } from 'lucide-react'
import WebsiteLayout from '~/components/layout'

const ExamExpiredPage = () => {
  return (
    <>
      <Head>
        <title>وقت الإختبار انتهى</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto max-w-md rounded-md bg-red-600 p-4 text-center text-white shadow'>
          <AlertCircle size={80} className='mx-auto mb-3' />
          <h1 className='text-2xl'>وقت الإختبار انتهى</h1>
          <p className='text-slate-100'>
            نأسف لذلك لكنك تأخرت عن الدخول للإختبار ولا يمكنك اجراء هذا
            الإختبار.
          </p>
        </div>
      </div>
    </>
  )
}

ExamExpiredPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export default ExamExpiredPage
