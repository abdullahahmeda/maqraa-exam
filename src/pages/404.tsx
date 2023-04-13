import Head from 'next/head'
import WebsiteLayout from '../components/layout'

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>هذه الصفحة غير موجودة</title>
      </Head>
      <div className='container mx-auto py-4'>
        <div className='mx-auto max-w-md bg-white shadow'>
          <h1 className='text-center text-2xl font-bold'>
            هذه الصفحة غير موجودة
          </h1>
        </div>
      </div>
    </>
  )
}

NotFoundPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export default NotFoundPage
