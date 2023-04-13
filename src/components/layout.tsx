import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactNode } from 'react'

const Navbar = () => {
  const { data: session, status } = useSession()
  return (
    <nav className='bg-white py-4 shadow-xl'>
      <div className='container mx-auto flex max-w-5xl items-center justify-between'>
        <Link href='/' className='text-xl font-bold text-neutral-800'>
          حفاظ الوحيين
        </Link>
        <div>
          <ul className='flex gap-10'>
            {status === 'authenticated' ? (
              <>
                <li>
                  أهلاً بك، {session.user.name?.split(' ')[0] || 'مستخدم'}
                </li>
                <li className='font-bold'>
                  <Link href='/dashboard'>لوحة التحكم</Link>
                </li>
                <li className='font-bold'>
                  <Link href='/'>بدأ اختبار</Link>
                </li>
                <li className='font-bold'>
                  <button onClick={() => signOut()}>تسجيل خروج</button>
                </li>
              </>
            ) : (
              <>
                <li className='font-bold'>
                  <Link href='/login'>دخول</Link>
                </li>
                <li className='font-bold'>
                  <Link href='/register'>تسجيل</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default function WebsiteLayout ({ children }: { children: ReactNode }) {
  return (
    <>
      <style global jsx>{`
        body {
          background: linear-gradient(
              to bottom,
              rgba(92, 77, 66, 0.9) 0%,
              rgba(92, 77, 66, 0.9) 100%
            ),
            url(/bg.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-size: cover;
          height: 100vh;
        }
      `}</style>
      <Navbar />
      {children}
    </>
  )
}
