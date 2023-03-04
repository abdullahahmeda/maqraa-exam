import clsx from 'clsx'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

const Select = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<'select'>
>(function SelectRef ({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={clsx(
        'border-zinc-300 focus:border-zinc-400 focus:ring-0',
        props.disabled && 'bg-neutral-200 text-neutral-400',
        className
      )}
    />
  )
})

export default Select
