import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import type { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Cairo } from 'next/font/google'
import { z } from 'zod'
import { customErrorMap } from '../validation/customErrorMap'
import dayjs from 'dayjs'
import 'dayjs/locale/ar-sa'
import { api } from '../utils/api'
import { Toaster } from '~/components/ui/toaster'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'auto',
})

import '../styles/globals.css'
import { DirectionProvider } from '@radix-ui/react-direction'

z.setErrorMap(customErrorMap)

dayjs.locale('ar-sa')

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const MyApp /*: AppType<{ session: Session | null }>*/ = ({
  Component,
  pageProps: { session, ...pageProps },
}: any) => {
  const getLayout =
    (Component as NextPageWithLayout).getLayout || ((page) => page)

  return (
    <>
      <DirectionProvider dir='rtl'>
        <SessionProvider session={session}>
          {getLayout(
            <>
              <style jsx global>
                {`
                  * {
                    font-family: ${cairo.style.fontFamily};
                  }
                `}
              </style>
              <Component {...pageProps} />
              <Toaster />
            </>
          )}
        </SessionProvider>
      </DirectionProvider>
    </>
  )
}

export default api.withTRPC(MyApp as AppType)
