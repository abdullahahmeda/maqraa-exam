import { db } from '~/server/db'
import { getServerAuthSession } from '~/server/auth'
import { notFound, redirect } from 'next/navigation'
import { ResetPasswordForm } from './_components/form'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إعادة تعيين كلمة المرور | ${siteName}`,
  }
}

type Params = { token: string }

const PasswordTokenPage = async (props: { params: Promise<Params> }) => {
  const params = await props.params;

  const {
    token
  } = params;

  const session = await getServerAuthSession()
  if (session?.user) return redirect('/')

  const passwordToken = await db
    .selectFrom('ResetPasswordToken')
    .where('token', '=', token)
    .where('expires', '>', new Date())
    .executeTakeFirst()

  if (!passwordToken) return notFound()

  return <ResetPasswordForm token={token} />
}

export default PasswordTokenPage
