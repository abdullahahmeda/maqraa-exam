import { redirect } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'

export default async function Layout({
  children,
  modals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
}) {
  const session = await getServerAuthSession()
  if (session?.user.role === 'STUDENT') return redirect('/')

  return (
    <>
      {children}
      {modals}
    </>
  )
}
