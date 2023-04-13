// import type { NextPageWithLayout } from '../_app'
import DashboardLayout from '~/components/dashboard/layout'
import Head from 'next/head'

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title>لوحة التحكم</title>
      </Head>
      <div>Hello</div>
    </>
  )
}

DashboardPage.getLayout = (page: any) => {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default DashboardPage
