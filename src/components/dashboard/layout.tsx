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

export const menuLinks = {
  ADMIN: [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      label: 'الرئيسية',
      key: '/dashboard',
      order: 1,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      label: 'المستخدمون',
      key: '/dashboard/users',
      order: 2,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
      label: 'الأسئلة',
      key: '/dashboard/questions',
      order: 3,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
      label: 'أنواع الأسئلة',
      key: '/dashboard/questions/styles',
      order: 4,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'إختبارات النظام',
      key: '/dashboard/system-exams',
      order: 5,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'الإختبارات التجريبية',
      key: '/dashboard/quizzes',
      order: 6,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'المقررات',
      key: '/dashboard/courses',
      order: 7,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'المناهج',
      key: '/dashboard/curricula',
      order: 8,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'الدورات',
      key: '/dashboard/cycles',
      order: 9,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'المسارات',
      key: '/dashboard/tracks',
      order: 10,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'تبليغات الأخطاء',
      key: '/dashboard/error-reports',
      order: 11,
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'التقارير',
      key: '/dashboard/reports',
      order: 12,
    },
  ],
  CORRECTOR: [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'إختبارات النظام',
      key: '/dashboard/my-exams',
    },
  ],
  STUDENT: [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',
      label: 'إختبارات النظام',
      key: '/dashboard/my-exams',
    },
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
