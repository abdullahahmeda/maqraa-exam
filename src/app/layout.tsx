import '~/styles/globals.css'
import { Toaster } from '~/components/ui/sonner'

import { Noto_Sans_Arabic } from 'next/font/google'

import { TRPCReactProvider } from '~/trpc/react'
import SessionProvider from './_components/session-provider'

import { getServerAuthSession } from '~/server/auth'
import { DirectionProvider } from './_components/direction-provider'

const font = Noto_Sans_Arabic({
  subsets: ['arabic'],
})

export const metadata = {
  title: 'مقرأة الوحيين',
  description: 'مقرأة الوحيين هي مقرأة تهتم بحفظ السنة',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()
  return (
    <html lang='ar' dir='rtl'>
      <DirectionProvider dir='rtl'>
        <body className={`${font.className}`}>
          <TRPCReactProvider>
            <SessionProvider session={session}>{children}</SessionProvider>
          </TRPCReactProvider>
          <Toaster
            richColors
            closeButton
            toastOptions={{ className: `${font.className}` }}
          />
        </body>
      </DirectionProvider>
    </html>
  )
}
