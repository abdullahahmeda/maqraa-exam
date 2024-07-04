import { endOfMonth, startOfMonth } from 'date-fns'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `لوحة التحكم | ${siteName}`,
  }
}
export default async function Dashboard() {
  const session = await getServerAuthSession()
  if (session!.user.role === 'ADMIN') {
    const date = new Date()
    const thisMonthStart = startOfMonth(date)
    const thisMonthEnd = endOfMonth(date)
    const { count: thisMonthExams } = await db
      .selectFrom('SystemExam')
      .select(({ fn }) => [fn.count<string>('id').as('count')])
      .where(({ and, eb }) =>
        and([
          eb('createdAt', '>=', thisMonthStart),
          eb('createdAt', '<=', thisMonthEnd),
        ]),
      )
      .executeTakeFirstOrThrow()
    return (
      <div>
        <div className='grid lg:grid-cols-4'>
          <div className='p-4 text-center text-white bg-green-600 border rounded-md'>
            <h3 className='text-2xl font-semibold'>عدد الإختبارات هذا الشهر</h3>
            <p className='text-lg'>{thisMonthExams}</p>
          </div>
        </div>
      </div>
    )
  }
  return <div>مرحباً بكم</div>
}
