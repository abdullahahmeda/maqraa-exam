import Head from 'next/head'
import { MdCheckCircleOutline } from 'react-icons/md'
import WebsiteLayout from '~/components/layout'

const ExamSubmittedPage = () => {
  return (
    <>
      <Head>
        <title>تم تسليم الاختبار بنجاح!</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto max-w-md bg-green-600 p-2 text-center text-white shadow'>
          <MdCheckCircleOutline size={80} className='mx-auto mb-3' />
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
