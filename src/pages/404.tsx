import Head from 'next/head'
import WebsiteLayout from '../components/layout'
import { AlertTriangle } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>هذه الصفحة غير موجودة</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto flex max-w-md flex-col items-center gap-2 rounded-md bg-white p-4 shadow'>
          <AlertTriangle className='h-10 w-10 text-red-600' />
          <h1 className='text-xl font-bold'>هذه الصفحة غير موجودة</h1>
        </div>
      </div>
    </>
  )
}

NotFoundPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export default NotFoundPage
