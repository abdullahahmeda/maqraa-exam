import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html lang='ar' dir='rtl'>
      <Head>
        <link rel='icon' type='image/png' href='/maqraa_app.png' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
