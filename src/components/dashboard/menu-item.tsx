import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, ReactNode, useReducer, useRef } from 'react'
import { UrlObject } from 'url'
import clsx from 'clsx'
import { useTheme } from '../../lib/theme'
import { MdOutlineExpandMore } from 'react-icons/md'

const DropdownContent = styled('div', {
  shouldForwardProp: prop => prop !== 'open'
})(({ open }: any) => ({
  transition: 'transform 0.3s',
  ...(open && {
    transform: 'translateY(0%)'
  })
}))

type MenuLinkProps = {
  text: ReactNode
  startIcon: ReactNode
  href?: string | UrlObject
  endIcon?: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  isActive?: boolean | ((pathname: string) => boolean)
  className?: string
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
  className
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
      // onClick={closeSidebar}
      onClick={onClick}
    >
      {startIcon}
      {text}
      {endIcon}
    </Link>
  )
}

export default function MenuItem ({
  text,
  startIcon,
  dropdown,
  href = '#0',
  isActive: _isActive,
  endIcon,
  className = ''
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
        {...{ href, startIcon, text, isActive, className }}
        endIcon={
          endIcon !== undefined
            ? endIcon
            : dropdown && (
                <MdOutlineExpandMore
                  size={24}
                  className={clsx(
                    'mr-auto ml-3 transition-transform',
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
              : 0
          }}
          ref={dropdownContentRef}
        >
          <DropdownContent open={isDropdownOpen}>
            <ul className='mx-1 mt-1 overflow-hidden'>
              {dropdown.map((props, index) => (
                <li key={index}>
                  <MenuItem {...props} />
                </li>
              ))}
            </ul>
          </DropdownContent>
        </div>
      )}
    </>
  )
}
