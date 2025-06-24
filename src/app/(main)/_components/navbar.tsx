'use client'

import { MenuIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useReducer } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { getFirstName } from '~/utils/users'

export const Navbar = () => {
  const [isMenuOpen, toggleMenu] = useReducer((isOpen) => !isOpen, false)
  const { data: session, status } = useSession()

  return (
    <nav className='py-4 text-neutral-100'>
      <div className='container items-center justify-between md:flex'>
        <div className='flex justify-between'>
          <Link href='/' className='text-xl font-bold'>
            حفاظ الوحيين
          </Link>
          <button onClick={toggleMenu} className='md:hidden'>
            <MenuIcon size={20} />
          </button>
        </div>
        <div className='-mx-8 md:mx-0 bg-white md:bg-transparent'>
          <ul
            className={cn(
              'container py-4 md:py-0 mt-4 flex-col gap-5 md:mr-auto md:mt-0 md:flex md:items-center md:flex-row md:px-0',
              isMenuOpen ? 'flex' : 'hidden',
            )}
          >
            {status === 'authenticated' ? (
              <>
                <li>
                  <p className='text-black'>
                    أهلاً بك، {getFirstName(session?.user.name)}
                  </p>
                </li>
                <li className='block font-bold'>
                  <a
                    href='/dashboard'
                    className={buttonVariants({ variant: 'link' })}
                  >
                    لوحة التحكم
                  </a>
                </li>
                <li className='block font-bold'>
                  <a
                    href='/start-quiz'
                    className={buttonVariants({ variant: 'link' })}
                  >
                    بدأ إختبار تجريبي
                  </a>
                </li>
                <li className='block font-bold'>
                  <button
                    onClick={() => signOut()}
                    className={buttonVariants({ variant: 'link' })}
                  >
                    تسجيل خروج
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='block font-bold'>
                  <a
                    href='/'
                    className={buttonVariants({ variant: 'link' })}
                  >
                    دخول
                  </a>
                </li>
                <li className='block font-bold'>
                  <a
                    href='/start-quiz'
                    className={buttonVariants({ variant: 'link' })}
                  >
                    بدأ إختبار تجريبي
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
