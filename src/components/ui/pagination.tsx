import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '~/lib/utils'
import {
  type ButtonProps,
  buttonVariants,
  Button,
} from '~/components/ui/button'
import Link from 'next/link'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  href = '#',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    href={href}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

type PaginationButtonProps = {
  isActive?: boolean
} & ButtonProps

const PaginationButton = ({
  isActive,
  size = 'icon',
  ...props
}: PaginationButtonProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    size={size}
    variant={isActive ? 'outline' : 'ghost'}
    {...props}
  />
)
PaginationButton.displayName = 'PaginationButton'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label='الذهاب للصفحة السابقة'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <ChevronRight className='h-4 w-4' />
  </PaginationButton>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label='الذهاب للصفحة التالية'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
  </PaginationButton>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
}
