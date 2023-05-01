// import type { NextPageWithLayout } from '../_app'
import DashboardLayout from '~/components/dashboard/layout'
import Head from 'next/head'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { prisma } from '~/server/db'
import { UserRole } from '~/constants'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import dayjs from 'dayjs'

const DashboardPage = ({
  examsCount,
  ungradedExamsCount,
  studentsCount,
  last30DaysExamsCounts
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>لوحة التحكم</title>
      </Head>
      <div>
        <ResponsiveContainer height={300}>
          <BarChart
            data={last30DaysExamsCounts}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }}
            style={{ direction: 'ltr' }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='createdAt'
              tickFormatter={tickFormat =>
                dayjs(tickFormat).format('DD/MM/YYYY')
              }
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              labelFormatter={value => {
                return dayjs(value).format('التاريخ: DD/MM/YYYY')
              }}
            />
            <Legend />
            <Bar
              type='monotone'
              dataKey='_count._all'
              fill='#8884d8'
              name='الكل'
            />
            <Bar
              type='monotone'
              dataKey='_count.grade'
              fill='#82ca9d'
              name='المصححة'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

DashboardPage.getLayout = (page: any) => {
  return <DashboardLayout>{page}</DashboardLayout>
}

export async function getServerSideProps (context: GetServerSidePropsContext) {
  const studentsCount = await prisma.user.count({
    where: { role: UserRole.STUDENT }
  })
  const examsCount = await prisma.exam.count()
  const ungradedExamsCount = await prisma.exam.count({ where: { grade: null } })
  const last30DaysExamsCounts = await prisma.exam.groupBy({
    by: ['createdAt'],
    _count: {
      _all: true,
      grade: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    props: {
      studentsCount,
      examsCount,
      ungradedExamsCount,
      last30DaysExamsCounts
    }
  }
}

export default DashboardPage
