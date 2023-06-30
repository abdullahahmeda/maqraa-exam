import {
  LayoutGrid,
  Library,
  ListMusic,
  Mic2,
  Music,
  Music2,
  PlayCircle,
  Radio,
  User,
  Home,
  Settings,
} from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button, buttonVariants } from '~/components/ui/button'
import Link from 'next/link'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('pb-12', className)}>
      <div className='px-3 py-2'>
        <div className='space-y-1'>
          <Link
            href='/'
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'w-full justify-start'
            )}
          >
            <Home className='ml-2 h-4 w-4' />
            الرئيسية
          </Link>
          <Link
            href='#!'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <LayoutGrid className='ml-2 h-4 w-4' />
            المصححون
          </Link>
          <Link
            href='/dashboard/users'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <User className='ml-2 h-4 w-4' />
            المستخدمون
          </Link>
          <Link
            href='#!'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <Radio className='ml-2 h-4 w-4' />
            الاختبارات
          </Link>
          <Link
            href='/dashboard/questions'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <Radio className='ml-2 h-4 w-4' />
            الأسئلة
          </Link>
          <Link
            href='/dashboard/settings'
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start'
            )}
          >
            <Settings className='ml-2 h-4 w-4' />
            الإعدادت
          </Link>
        </div>
      </div>
    </div>
  )
}
