import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '~/server/auth'
import { ReactElement, ReactNode, useEffect } from 'react'
import { api } from '~/utils/api'
import { ActivityIcon, LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

type FieldValues = {
  name: string
  phone: string
  changePassword: boolean
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

type Props = {
  user: { name: string; phone: string | null }
}

const ReportCard = ({
  className,
  label,
  icon: Icon,
  value,
}: {
  className?: string
  label: string
  icon: LucideIcon
  value: ReactNode
}) => {
  return (
    <div
      className={cn(
        'flex rounded-md bg-green-600 text-white shadow',
        className
      )}
    >
      <div className='p-4'>
        <h4 className='text-xl'>{label}</h4>
        <p className='text-2xl font-semibold'>{value}</p>
      </div>
      <div className='mr-auto flex w-24 items-center justify-center bg-white/25'>
        <Icon className='h-10 w-10' />
      </div>
    </div>
  )
}

const ReportsPage = () => {
  const { data: cycles } = api.cycle.list.useQuery()
  return (
    <>
      <Head>
        <title>التقارير</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>التقارير</h2>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4'>
        <ReportCard label='test' value={100} icon={ActivityIcon} />
      </div>
    </>
  )
}

ReportsPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  if (!session?.user) return { notFound: true }

  // const examsCountByType = await prisma.quiz.groupBy({
  //   by: ['type'],
  //   where: { systemExamId: { not: null } },
  //   _count: true,
  // })
  // const examsCount = await prisma.quiz.count({
  //   where: { systemExamId: { not: null } },
  // })

  // const gradesAverageByType = await prisma.quiz.groupBy({
  //   by: ['type'],
  //   where: { systemExamId: { not: null } },
  //   _avg: { percentage: true },
  // })
  // const gradesAverage = await prisma.quiz.aggregate({
  //   _avg: { percentage: true },
  //   where: { systemExamId: { not: null } },
  // })

  return {
    props: {
      session,
    },
  }
}

export default ReportsPage
