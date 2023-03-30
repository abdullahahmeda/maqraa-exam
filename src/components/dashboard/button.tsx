import clsx from 'clsx'
import type { ElementType, ReactNode } from 'react'
import Spinner from '../spinner'

interface ButtonProps<T extends ElementType> {
  as?: T
  variant?: 'primary' | 'success' | 'error'
  loading?: boolean
  children?: ReactNode
}

export default function DashboardButton<T extends ElementType = 'button'> ({
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
          'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-200':
            !variant && !disabled,
          'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500':
            variant === 'primary' && !disabled,
          'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500':
            variant === 'success' && !disabled,
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600':
            variant === 'error' && !disabled
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
