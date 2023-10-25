import Head from 'next/head'
import { CheckCircle2 } from 'lucide-react'
import WebsiteLayout from '~/components/layout'

const ExamSubmittedPage = () => {
  return (
    <>
      <Head>
        <title>تم تسليم الاختبار بنجاح!</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto max-w-md rounded-md bg-green-600 p-4 text-center text-white shadow'>
          <CheckCircle2 size={80} className='mx-auto mb-3' />
          <h1 className='text-2xl'>تم تسليم الاختبار بنجاح!</h1>
          <p className='text-slate-100'>
            سيتم ارسال رسالة على البريد الالكتروني بالدرجة بعد تصحيح الاختبار
            بإذن الله تعالى.
          </p>
        </div>
      </div>
    </>
  )
}

ExamSubmittedPage.getLayout = (page: any) => (
  <WebsiteLayout>{page}</WebsiteLayout>
)

export default ExamSubmittedPage
