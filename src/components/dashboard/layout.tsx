import { type ReactNode, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
  MdHome,
  MdMenu,
  MdMessage,
  MdMenuBook,
  MdSettings,
  MdTextSnippet,
  MdAssignment,
  MdGroups
} from 'react-icons/md'
import useOnClickOutside from '~/hooks/useOnClickOutside'
import useMediaQuery from '~/hooks/useMediaQuery'
import MenuItem from './menu-item'
import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import { getFirstName } from '~/utils/users'

const sidebarMiniVariantWidth = 80
const sidebarWidth = 300

const Sidebar = styled('div', {
  shouldForwardProp: prop => prop !== 'open'
})(({ open }: any) => ({
  overflow: 'hidden',
  transition: 'all .3s',
  width: 0,
  zIndex: 10,
  ...(open && {
    width: sidebarWidth
  }),
  '@media (min-width: 1024px)': {
    width: sidebarMiniVariantWidth,
    ...(open && {
      width: sidebarWidth
    })
  }
  // ':hover': {
  //   width: sidebarWidth
  // }
}))

const LayoutWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'open'
})(({ open }: any) => ({
  marginRight: 0,
  transition: 'margin-right .3s',

  '@media (min-width: 1024px)': {
    marginRight: `${sidebarMiniVariantWidth}px`,
    ...(open && {
      marginRight: sidebarWidth
    })
  }
}))

const Overlay = styled('div', {
  shouldForwardProp: prop => prop !== 'open'
})(({ open }: any) => ({
  display: 'block',
  position: 'fixed',
  left: 0,
  top: 0,
  background: 'rgba(0, 0, 0, .3)',
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity .3s',
  pointerEvents: 'none',

  ...(open && {
    opacity: 1
  })
}))

export default function DashboardLayout ({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data: session } = useSession()

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebar = () => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)

  const sidebarRef = useRef(null)

  useOnClickOutside(sidebarRef, () => {
    if (!isDesktop) closeSidebar()
  })

  return (
    <>
      <Sidebar
        className={clsx(
          'fixed right-0 top-0 bottom-0 max-w-full bg-blue-600 text-white',
          (isSidebarOpen || isDesktop) && 'px-3'
        )}
        open={isSidebarOpen}
        ref={sidebarRef}
      >
        <div>
          <h1
            className={clsx(
              'mt-5 whitespace-nowrap text-center text-xl font-semibold transition-opacity',
              {
                'opacity-0': !isSidebarOpen
              }
            )}
          >
            أهلاً بك، {getFirstName(session?.user.name)}
          </h1>

          <ul className='justify-content-end flex-grow-1 mt-3'>
            <MenuItem
              startIcon={
                <MdHome
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                  size={24}
                />
              }
              text='الرئيسية'
              href='/dashboard'
              className='mb-2'
              isActive={pathname => pathname === '/dashboard'}
              closeSidebar={closeSidebar}
            />
            <MenuItem
              startIcon={
                <MdMenuBook
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='المقررات'
              className='mb-2'
              href='/dashboard/courses'
              closeSidebar={closeSidebar}
            />
            <MenuItem
              startIcon={
                <MdAssignment
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='المناهج'
              className='mb-2'
              href='/dashboard/curricula'
              closeSidebar={closeSidebar}
            />
            <MenuItem
              startIcon={
                <MdGroups
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='المستخدمون'
              className='mb-2'
              href='/dashboard/users'
              closeSidebar={closeSidebar}
            />

            <MenuItem
              startIcon={
                <MdMessage
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='الأسئلة'
              className='mb-2'
              href='/dashboard/questions'
              closeSidebar={closeSidebar}
            />
            <MenuItem
              startIcon={
                <MdTextSnippet
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='التسليمات'
              className='mb-2'
              href='/dashboard/exams'
              closeSidebar={closeSidebar}
            />

            <MenuItem
              startIcon={
                <MdSettings
                  size={24}
                  className='ml-3 w-[calc(80px-1.5rem)] flex-shrink-0'
                />
              }
              text='الإعدادات'
              href='/dashboard/settings'
              closeSidebar={closeSidebar}
            />
          </ul>
        </div>
      </Sidebar>
      {!isDesktop && <Overlay open={isSidebarOpen} />}
      <LayoutWrapper open={isSidebarOpen}>
        <nav className='mx-3 mt-2 rounded-md bg-blue-500 py-3 text-white lg:mx-5'>
          <div className='px-3'>
            <div className='flex items-center'>
              <button
                onClick={toggleSidebar}
                className={`ml-4 rounded p-2 transition-colors hover:bg-black/25 ${
                  isSidebarOpen ? 'bg-black/25' : ''
                }`}
              >
                <MdMenu size={24} />
              </button>
              <h1>لوحة التحكم</h1>
              <button
                className='mr-auto rounded px-3 py-2 transition-colors hover:bg-zinc-900/10'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </nav>
        <main className='mt-3 px-3 lg:px-5'>{children}</main>
      </LayoutWrapper>
    </>
  )
}
