import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

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

  return (
    <div className={cn('pb-12', className)}>
      <div className='px-3 py-2'>
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
