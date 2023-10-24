import { type ReactNode, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { getFirstName } from '~/utils/users'
import { Sidebar } from '~/components/ui/sidebar'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'
import { Menu, Construction, Home, Settings, Users } from 'lucide-react'

const menuLinks = {
  ADMIN: [
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'الرئيسية',
      href: '/dashboard',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'المستخدمون',
      href: '/dashboard/users',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'الأسئلة',
      href: '/dashboard/questions',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/system-exams',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'الإختبارات المفتوحة',
      href: '/dashboard/quizzes',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'المقررات',
      href: '/dashboard/courses',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'المناهج',
      href: '/dashboard/curricula',
    },
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'الدورات',
      href: '/dashboard/cycles',
    },
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'المسارات',
      href: '/dashboard/tracks',
    },
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'تبليغات الأخطاء',
      href: '/dashboard/error-reports',
    },
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'التقارير',
      href: '/dashboard/reports',
    },
    {
      icon: <Settings className='ml-2 h-4 w-4' />,
      label: 'الإعدادات',
      href: '/dashboard/settings',
    },
  ],
  CORRECTOR: [
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/system-exams',
    },
  ],
  STUDENT: [
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/system-exams',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'الإختبارات المفتوحة',
      href: '/dashboard/quizzes',
    },
  ],
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      <nav className='fixed left-0 right-0 top-0 h-16 border-b bg-background'>
        <div className='flex h-full items-center justify-between px-4'>
          <div className='flex items-center'>
            <Button
              onClick={toggleSidebar}
              size='icon'
              variant={isSidebarOpen ? 'secondary' : 'ghost'}
              className='ml-4 md:hidden'
            >
              <Menu />
            </Button>
            <h1>لوحة التحكم</h1>
          </div>
          <Button
            className='mr-auto'
            variant='outline'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            تسجيل الخروج
          </Button>
        </div>
      </nav>
      <div className='md:flex'>
        <Sidebar
          setIsSidebarOpen={setIsSidebarOpen}
          className={cn(
            'fixed top-16 z-10 hidden h-[calc(100vh-4rem)] w-full border-l bg-background md:block md:w-72',
            isSidebarOpen && 'block'
          )}
          links={
            session?.user.role
              ? menuLinks[session!.user.role as keyof typeof menuLinks]
              : []
          }
        />
        <main className='min-h-screen flex-1 border-r bg-[#f8f9fa] pb-4 pl-4 pr-4 pt-20 md:pr-[19rem]'>
          {children}
        </main>
      </div>
    </>
  )
}
