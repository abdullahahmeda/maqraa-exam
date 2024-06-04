import { notFound } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'

export default async function Layout({
  children,
  modals,
  utilityModals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
  utilityModals: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (session?.user.role !== 'ADMIN') notFound()

  return (
    <>
      {children}
      {modals}
      {utilityModals}
    </>
  )
}
