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
        <div className='flex flex-col items-center gap-2 mx-auto rounded-md p-4 max-w-md bg-white shadow'>
          <AlertTriangle className='h-10 w-10 text-red-600' />
          <h1 className='text-xl font-bold'>
            هذه الصفحة غير موجودة
          </h1>
        </div>
      </div>
    </>
  )
}

NotFoundPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export default NotFoundPage
