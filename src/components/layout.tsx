import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactNode, useReducer, useState } from 'react'
import { MdMenu } from 'react-icons/md'
import { getFirstName } from '~/utils/users'

const Navbar = () => {
  const [isMenuOpen, toggleMenu] = useReducer((isOpen) => !isOpen, false)
  const { data: session, status } = useSession()
  return (
    <nav className='bg-white py-4 shadow-xl'>
      <div className='container mx-auto max-w-5xl items-center justify-between md:flex'>
        <div className='flex justify-between'>
          <Link href='/' className='text-xl font-bold text-neutral-800'>
            حفاظ الوحيين
          </Link>
          <button onClick={toggleMenu} className='md:hidden'>
            <MdMenu size={20} />
          </button>
        </div>
        <div>
          <ul
            className={clsx(
              'container mt-4 flex-col gap-5 md:mr-auto md:mt-0 md:flex md:flex-row md:px-0',
              {
                hidden: !isMenuOpen,
                flex: isMenuOpen,
              }
            )}
          >
            {status === 'authenticated' ? (
              <>
                <li>أهلاً بك، {getFirstName(session?.user.name)}</li>
                {session.user.role !== 'STUDENT' && <li className='block font-bold'>
                  <Link href='/dashboard' className='block'>
                    لوحة التحكم
                  </Link>
                </li>}
                <li className='block font-bold'>
                  <Link href='/' className='block'>
                    بدأ اختبار
                  </Link>
                </li>
                <li className='block font-bold'>
                  <button
                    onClick={() => signOut()}
                    className='w-100 block text-right'
                  >
                    تسجيل خروج
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='block font-bold'>
                  <Link href='/login' className='block'>
                    دخول
                  </Link>
                </li>
                {/* <li className='block font-bold'>
                  <Link href='/register' className='block'>
                    تسجيل
                  </Link>
                </li> */}
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
          min-height: 100vh;
        }
      `}</style>
      <Navbar />
      {children}
    </>
  )
}
