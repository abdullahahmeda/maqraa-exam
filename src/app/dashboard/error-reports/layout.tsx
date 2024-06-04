import { notFound } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (session?.user.role !== 'ADMIN') notFound()

  return <>{children}</>
}
