import { type ReactNode, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { getFirstName } from '~/utils/users'
import { Sidebar } from '~/components/ui/sidebar'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'
import {
  Menu,
  Construction,
  Home,
  Settings,
  Users,
  HelpCircle,
} from 'lucide-react'

const menuLinks = {
  ADMIN: [
    {
      icon: <Home className='ml-2 h-4 w-4' />,
      label: 'الرئيسية',
      href: '/dashboard',
    },
    {
      icon: <Users className='ml-2 h-4 w-4' />,
      label: 'المستخدمون',
      href: '/dashboard/users',
    },
    {
      icon: <HelpCircle className='ml-2 h-4 w-4' />,
      label: 'الأسئلة',
      href: '/dashboard/questions',
    },
    {
      icon: <HelpCircle className='ml-2 h-4 w-4' />,
      label: 'أنواع الأسئلة',
      href: '/dashboard/questions/styles',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/system-exams',
    },
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'الإختبارات التجريبية',
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
  ],
  CORRECTOR: [
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/my-exams',
    },
  ],
  STUDENT: [
    {
      icon: <Construction className='ml-2 h-4 w-4' />,
      label: 'إختبارات النظام',
      href: '/dashboard/my-exams',
    },
    // TODO: review this

    // {
    //   icon: <Construction className='ml-2 h-4 w-4' />,
    //   label: 'الإختبارات المفتوحة',
    //   href: '/dashboard/quizzes',
    // },
  ],
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      <nav className='fixed left-0 right-0 top-0 z-10 h-16 border-b bg-white'>
        <div className='flex h-full items-center justify-between px-4'>
          <div className='flex items-center'>
            <Button
              onClick={toggleSidebar}
              size='icon'
              variant={isSidebarOpen ? 'secondary' : 'ghost'}
              className='ml-4'
            >
              <Menu />
            </Button>
            <h1 className='text-lg font-bold'>لوحة التحكم</h1>
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
      <div>
        <Sidebar
          setIsSidebarOpen={setIsSidebarOpen}
          className={cn(
            'fixed top-16 z-10 h-[calc(100vh-4rem)] w-full translate-x-full border-l bg-background transition-transform md:w-72',
            isSidebarOpen && 'translate-x-0'
          )}
          links={
            session?.user.role
              ? menuLinks[session!.user.role as keyof typeof menuLinks]
              : []
          }
        />
        <main
          className={cn(
            'min-h-screen flex-1 border-r bg-[#f8f9fa] pb-4 pl-4 pr-4 pt-20 transition-[padding]',
            isSidebarOpen && 'md:pr-[19rem]'
          )}
        >
          {children}
        </main>
      </div>
    </>
  )
}
