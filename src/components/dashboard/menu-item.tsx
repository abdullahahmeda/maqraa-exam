import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, ReactNode, useReducer, useRef } from 'react'
import { UrlObject } from 'url'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '~/lib/theme'

type MenuLinkProps = {
  text: ReactNode
  startIcon: ReactNode
  href?: string | UrlObject
  endIcon?: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  isActive?: boolean | ((pathname: string) => boolean)
  className?: string
  closeSidebar: any
}

type MenuItemProps = {
  dropdown?: MenuLinkProps[]
} & MenuLinkProps

const MenuLink = ({
  text,
  startIcon,
  href = '#0',
  endIcon,
  onClick,
  isActive,
  className,
  closeSidebar,
}: MenuLinkProps) => {
  // const { closeSidebar } = useTheme()

  return (
    <Link
      href={href}
      className={clsx(
        'flex w-full cursor-pointer items-center whitespace-nowrap rounded-lg py-4 transition-colors hover:bg-black/25',
        isActive && 'bg-black/25',
        !isActive && 'bg-black/10',
        className
      )}
      onClick={(e) => {
        if (onClick) onClick(e)
        closeSidebar()
      }}
    >
      {startIcon}
      {text}
      {endIcon}
    </Link>
  )
}

export default function MenuItem({
  text,
  startIcon,
  dropdown,
  href = '#0',
  isActive: _isActive,
  endIcon,
  className = '',
  closeSidebar,
}: MenuItemProps) {
  const [isDropdownOpen, toggleDropdown] = useReducer(
    (state: boolean, _action_: any) => !state,
    false
  )

  const dropdownContentRef = useRef<HTMLDivElement>(null)

  const { pathname } = useRouter()
  let isActive = !!(href && pathname.startsWith(href.toString()))

  if (_isActive !== undefined)
    isActive = typeof _isActive === 'boolean' ? _isActive : _isActive(pathname)

  return (
    <>
      <MenuLink
        {...{ href, startIcon, text, isActive, className, closeSidebar }}
        endIcon={
          endIcon !== undefined
            ? endIcon
            : dropdown && (
                <ChevronDown
                  className={clsx(
                    'ml-3 mr-auto transition-transform',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              )
        }
        onClick={toggleDropdown}
      />

      {dropdown && (
        <div
          className={'overflow-hidden transition-[max-height]'}
          style={{
            maxHeight: isDropdownOpen
              ? dropdownContentRef.current?.scrollHeight
              : 0,
          }}
          ref={dropdownContentRef}
        ></div>
      )}
    </>
  )
}
