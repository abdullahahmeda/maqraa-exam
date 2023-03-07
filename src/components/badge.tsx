import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = {
  text: ReactNode
  variant?: 'primary' | 'success' | 'error' | 'warning'
} & ComponentPropsWithoutRef<'span'>

export default function Badge ({ text, variant, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs',
        !variant && 'bg-gray-200 text-black',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'success' && 'bg-green-500 text-black',
        variant === 'warning' && 'bg-orange-500 text-black',
        variant === 'error' && 'bg-red-500 text-black',
        className
      )}
    >
      {text}
    </span>
  )
}
