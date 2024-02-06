import App, { type AppType, AppContext } from 'next/app'
import type { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Rubik } from 'next/font/google'
import { z } from 'zod'
import { errorMap } from '../validation/errorMap'
import { arSA } from 'date-fns/locale'
import setDefaultOptions from 'date-fns/setDefaultOptions'
import { api } from '../utils/api'
import { Toaster } from '~/components/ui/sonner'
import { DirectionProvider } from '@radix-ui/react-direction'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getSiteName } from '~/services/setting'

const fontFamily = Rubik({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'auto',
})

import '../styles/globals.css'
import { SettingKey } from '~/kysely/enums'

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

  const { data: siteName } = api.setting.getSiteName.useQuery()

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
              {/* TODO: siteName is loaded at client side (not good for seo) */}
              <Component {...pageProps} siteName={siteName} />
              <SpeedInsights />
              <Toaster richColors closeButton />
            </>
          )}
        </SessionProvider>
      </DirectionProvider>
    </>
  )
}

MyApp.getInitialProps = async (context: AppContext) => {
  const ctx = await App.getInitialProps(context)

  return ctx

  // return { ...ctx, siteName: await getSiteName() }
}

export default api.withTRPC(MyApp as AppType)
