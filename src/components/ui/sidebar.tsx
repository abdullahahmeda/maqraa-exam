import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from './avatar'

type MenuLink = {
  icon: ReactNode
  label: ReactNode
  href: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links: MenuLink[]
  setIsSidebarOpen: (state: boolean) => void
}

export function Sidebar({ className, links, setIsSidebarOpen }: SidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className={cn('pb-12', className)}>
      <div className='flex h-full flex-col justify-between px-3 py-2'>
        <div className='space-y-1'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant: router.pathname === link.href ? 'default' : 'ghost',
                }),
                'w-full justify-start'
              )}
              // onClick={() => setIsSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex h-16 items-center justify-start gap-2'>
          <Avatar>
            <AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p>{session?.user.name}</p>
            <Link
              href='/dashboard/profile'
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' })
              )}
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
