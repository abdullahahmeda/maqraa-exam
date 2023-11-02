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
import { startOfDay, sub, format } from 'date-fns'

const DashboardPage = ({
  lastMonthExamsStats,
  lastMonthGradesStats,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log(last30DaysExamsCounts)
  return (
    <>
      <Head>
        <title>لوحة التحكم</title>
      </Head>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>الإحصائيات آخر 30 يوم</h2>
        <h3 className='mb-4 text-xl font-semibold '>إختبارات النظام</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <h3 className='mb-4 font-semibold text-gray-700'>
              التسليم والتصحيح
            </h3>
            <div className='rounded-md bg-white p-4 shadow'>
              {lastMonthExamsStats.length === 0 ? (
                <p className='text-muted'>لا يوجد بيانات</p>
              ) : (
                <ResponsiveContainer height={300}>
                  <BarChart
                    data={lastMonthExamsStats}
                    maxBarSize={15}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                    style={{ direction: 'ltr' }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey={(v) => v.name} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      wrapperClassName='rounded-md shadow'
                      wrapperStyle={{ direction: 'rtl' }}
                    />
                    <Legend />
                    <Bar
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.count)}
                      fill='#8884d8'
                      name='المستحقون للإختبار'
                    />
                    <Bar
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.submitted)}
                      fill='#92ac9d'
                      name='الإختبارات المسلمة'
                    />
                    <Bar
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.corrected)}
                      fill='#82ca9d'
                      name='الإختبارات المصححة'
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div>
            <h3 className='mb-4 font-semibold text-gray-700'>الدرجات</h3>
            <div className='rounded-md bg-white p-4 shadow'>
              {lastMonthGradesStats.length === 0 ? (
                <p>لا يوجد بيانات</p>
              ) : (
                <ResponsiveContainer height={300}>
                  <LineChart
                    data={lastMonthGradesStats}
                    maxBarSize={15}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                    style={{ direction: 'ltr' }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey={(v) => v.name} />
                    <YAxis
                      allowDecimals={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      wrapperStyle={{ direction: 'rtl' }}
                      wrapperClassName='rounded-md shadow'
                    />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.max)}
                      unit='%'
                      fill='#8884d8'
                      name='أعلى درجة'
                    />
                    <Line
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.avg)}
                      fill='#82ca9d'
                      unit='%'
                      name='المتوسط'
                    />
                    <Line
                      type='monotone'
                      dataKey={(obj) => '' + Number(obj.min)}
                      fill='#82ca9d'
                      unit='%'
                      name='أقل درجة'
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
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
        destination: '/dashboard/my-exams',
        permanent: false,
      },
    }

  const lastMonthExamsStats: {
    corrected: number
    graded: number
    systemExamId: string
  }[] = await prisma.$queryRaw`
    SELECT COUNT(q."correctorId") AS corrected, COUNT(q."submittedAt") AS submitted, COUNT(*), s."name" FROM "Quiz" q
    LEFT JOIN "SystemExam" s ON q."systemExamId" = s."id"
    WHERE q."createdAt" >= ${startOfDay(
      sub(new Date(), { days: 30 })
    )} AND q."systemExamId" IS NOT NULL
    GROUP BY s."name"
  `

  const lastMonthGradesStats: { max: number; avg: number; min: number }[] =
    await prisma.$queryRaw`
    SELECT MAX(q."percentage"), AVG(q."percentage"), MIN(q."percentage"), s."name" FROM "Quiz" q
    LEFT JOIN "SystemExam" s ON q."systemExamId" = s."id"
    WHERE q."correctorId" IS NOT NULL AND q."systemExamId" IS NOT NULL
    GROUP BY s."name"
  `

  return {
    props: {
      session,
      lastMonthExamsStats,
      lastMonthGradesStats,
    },
  }
}

export default DashboardPage
