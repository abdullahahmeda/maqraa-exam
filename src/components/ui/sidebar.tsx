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
}

export function Sidebar({ className, links }: SidebarProps) {
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
        </div>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <p>مرحباً بك {session?.user.name}</p>
        </div>
      </div>
    </div>
  )
}
