import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Cairo } from '@next/font/google'
import { Toaster } from 'react-hot-toast'
import { z } from 'zod'
import { customErrorMap } from '../validation/customErrorMap'
import dayjs from 'dayjs'
import 'dayjs/locale/ar-sa'

import { api } from '../utils/api'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'auto'
})

import '../styles/globals.css'

z.setErrorMap(customErrorMap)

dayjs.locale('ar-sa')

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const MyApp /*: AppType<{ session: Session | null }>*/ = ({
  Component,
  pageProps: { session, ...pageProps }
}: any) => {
  const getLayout =
    (Component as NextPageWithLayout).getLayout || (page => page)
  return getLayout(
    <>
      <style jsx global>
        {`
          * {
            font-family: ${cairo.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster position='bottom-center' />
    </>
  )
}

export default api.withTRPC(MyApp as AppType)
