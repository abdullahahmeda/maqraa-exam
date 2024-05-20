import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function Content({
  children,
  isOpen,
}: {
  children: ReactNode
  isOpen: boolean
}) {
  return (
    <main
      className={cn(
        'min-h-screen flex-1 border-r bg-[#f8f9fa] pb-4 pl-4 pr-4 pt-20 transition-[padding]',
        isOpen && 'md:pr-[19rem]',
      )}
    >
      {children}
    </main>
  )
}
