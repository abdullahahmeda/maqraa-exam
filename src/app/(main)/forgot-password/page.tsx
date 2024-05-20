import { getServerAuthSession } from '~/server/auth'
import { redirect } from 'next/navigation'
import { ForgotPasswordForm } from './_components/form'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `استعادة كلمة المرور | ${siteName}`,
  }
}

const ForgotPasswordPage = async () => {
  const session = await getServerAuthSession()

  if (session?.user) {
    return redirect('/')
  }

  return <ForgotPasswordForm />
}

export default ForgotPasswordPage
