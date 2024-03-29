import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import type { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Rubik } from 'next/font/google'
import { z } from 'zod'
import { errorMap } from '../validation/errorMap'
import { arSA } from 'date-fns/locale'
import setDefaultOptions from 'date-fns/setDefaultOptions'
import { api } from '../utils/api'
import { Toaster } from '~/components/ui/toaster'

const fontFamily = Rubik({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'auto',
})

import '../styles/globals.css'
import { DirectionProvider } from '@radix-ui/react-direction'

z.setErrorMap(errorMap)
setDefaultOptions({ locale: arSA })

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
                    font-family: ${fontFamily.style.fontFamily};
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
