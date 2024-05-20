'use client'

import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { UserIcon } from 'lucide-react'

type MenuLink = {
  icon: string | null
  label: ReactNode
  key: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: MenuLink[]
  isOpen: boolean
  setIsOpen: (state: boolean) => unknown
}

export function Sidebar({ menu: links, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div
      className={cn(
        'fixed top-16 z-10 h-[calc(100vh-4rem)] w-full translate-x-full border-l transition-transform bg-background pb-12 md:w-72 overflow-auto',
        isOpen && 'translate-x-0',
      )}
    >
      <div className='space-y-2 px-3 py-2'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <Avatar className='h-20 w-20'>
            <AvatarFallback>
              <UserIcon />
              {/* {session?.user.name?.[0]} */}
            </AvatarFallback>
          </Avatar>
          <p>{session?.user.name}</p>
        </div>
        <Separator />
        <div className='space-y-1'>
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.key}
              className={cn(
                buttonVariants({
                  variant: pathname === link.key ? 'secondary' : 'ghost',
                }),
                'w-full justify-start hover:border',
                pathname === link.key && 'border',
              )}
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false)
              }}
            >
              {link.icon ? (
                <div
                  className='ml-2 inline-block'
                  dangerouslySetInnerHTML={{ __html: link.icon }}
                />
              ) : null}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
