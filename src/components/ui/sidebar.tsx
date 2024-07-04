import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from './avatar'
import { Loader2Icon } from 'lucide-react'

type MenuLink = {
  icon: string | null
  label: ReactNode
  key: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links: MenuLink[]
  setIsSidebarOpen: (state: boolean) => void
  loading?: boolean
}

export function Sidebar({
  className,
  links,
  setIsSidebarOpen,
  loading = false,
}: SidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className={cn('pb-12', className)}>
      <div className='flex flex-col justify-between h-full px-3 py-2'>
        <div className='space-y-1'>
          {loading ? (
            <Loader2Icon className='mx-auto animate-spin' />
          ) : (
            links.map((link) => (
              <Link
                key={link.key}
                href={link.key}
                className={cn(
                  buttonVariants({
                    variant: router.pathname === link.key ? 'ghost' : 'ghost',
                  }),
                  'w-full justify-start',
                )}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false)
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
            ))
          )}
          {}
        </div>
        <div className='flex h-16 items-center justify-start gap-2'>
          <Avatar>
            <AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-center'>{session?.user.name}</p>
            <Link
              href='/dashboard/profile'
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
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
