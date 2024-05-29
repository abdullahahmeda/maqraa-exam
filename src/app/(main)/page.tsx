import Image from 'next/image'
import Link from 'next/link'
import { getServerAuthSession } from '~/server/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from '../_components/login-form'
import { api } from '~/trpc/server'
import { AlertTriangleIcon } from 'lucide-react'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `تسجيل الدخول | ${siteName}`,
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const session = await getServerAuthSession()

  if (session?.user) return redirect('/dashboard')

  return (
    <div className='mx-auto max-w-[360px] pt-20'>
      <div className='mb-4 text-center'>
        <Link href='https://mqraa.alwahyaen.com/' className='inline-block'>
          <Image
            src='/maqraa_app.png'
            alt='Logo'
            width='230'
            height='150'
            className='inline-block'
          />
        </Link>
      </div>
      {searchParams.callbackUrl && (
        <div className='bg-orange-500 flex items-center gap-2 rounded-md p-2 mb-2 text-neutral-50'>
          <AlertTriangleIcon className='h-4 w-4' />
          قم بتسجيل الدخول للمتابعة
        </div>
      )}
      <LoginForm />
    </div>
  )
}
