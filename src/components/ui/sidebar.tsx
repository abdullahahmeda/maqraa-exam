import { Construction, Home, Settings, Users } from 'lucide-react'

import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'

const menuLinks = [
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
    label: 'الإختبارات',
    href: '/dashboard/exams',
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
    icon: <Settings className='ml-2 h-4 w-4' />,
    label: 'الإعدادات',
    href: '/dashboard/settings',
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()

  return (
    <div className={cn('pb-12', className)}>
      <div className='px-3 py-2'>
        <div className='space-y-1'>
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant:
                    router.pathname === link.href ? 'secondary' : 'ghost',
                }),
                'w-full justify-start'
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {/* <Link
            href='#!'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <LayoutGrid className='ml-2 h-4 w-4' />
            المصححون
          </Link> */}
        </div>
      </div>
    </div>
  )
}
