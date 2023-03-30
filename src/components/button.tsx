import clsx from 'clsx'
import type { ElementType, ReactNode } from 'react'
import Spinner from './spinner'

interface ButtonProps<T extends ElementType> {
  as?: T
  variant?: 'primary' | 'success' | 'error'
  loading?: boolean
  children?: ReactNode
}

export default function Button<T extends ElementType = 'button'> ({
  as,
  variant,
  loading,
  children,
  disabled: _disabled,
  className,
  ...props
}: ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const Component = as || 'button'

  const disabled = _disabled || loading

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-1 rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-200':
            disabled,
          'bg-[#d9b14d] text-white shadow-md hover:bg-[#b79a50] hover:shadow-lg':
            variant === 'primary' && !disabled
        },

        className
      )}
      disabled={disabled}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </Component>
  )
}
