// import type { NextPageWithLayout } from '../_app'
import DashboardLayout from '~/components/dashboard/layout'
import Head from 'next/head'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { prisma } from '~/server/db'
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
  Bar,
} from 'recharts'
import { getServerAuthSession } from '~/server/auth'
import { UserRole } from '@prisma/client'
import { startOfDay, sub, format } from 'date-fns'

const DashboardPage = ({
  examsCount,
  ungradedExamsCount,
  studentsCount,
  last30DaysExamsCounts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log(last30DaysExamsCounts)
  return (
    <>
      <Head>
        <title>لوحة التحكم</title>
      </Head>
      <div>
        <ResponsiveContainer height={300}>
          <BarChart
            data={last30DaysExamsCounts as any[]}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            style={{ direction: 'ltr' }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='createdAt'
              tickFormatter={(tickFormat) => format(tickFormat, 'dd/MM/yyyy')}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              labelFormatter={(value) => {
                return format(value, 'التاريخ: dd/MM/yyyy')
              }}
            />
            <Legend />
            <Bar
              type='monotone'
              dataKey={(obj) => '' + Number(obj.count)}
              fill='#8884d8'
              name='الكل'
            />
            <Bar
              type='monotone'
              dataKey={(obj) => '' + Number(obj.graded)}
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== 'ADMIN')
    return {
      redirect: {
        destination: '/dashboard/exams',
        permanent: false,
      },
    }

  const studentsCount = await prisma.user.count({
    where: { role: UserRole.STUDENT },
  })
  const examsCount = await prisma.exam.count()
  const ungradedExamsCount = await prisma.exam.count({ where: { grade: null } })
  const last30DaysExamsCounts =
    await prisma.$queryRaw`SELECT COUNT("public"."Exam"."grade") AS graded, COUNT(*), CAST("public"."Exam"."createdAt" AS DATE) FROM "public"."Exam" WHERE "public"."Exam"."createdAt" >= ${startOfDay(
      sub(new Date(), { days: 30 })
    )} GROUP BY CAST("public"."Exam"."createdAt" AS DATE) ORDER BY CAST("public"."Exam"."createdAt" AS Date) ASC`

  return {
    props: {
      session,
      studentsCount,
      examsCount,
      ungradedExamsCount,
      last30DaysExamsCounts,
    },
  }
}

export default DashboardPage
