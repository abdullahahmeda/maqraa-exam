import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

const FieldErrorMessage = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'p'>) => {
  return (
    <p className={clsx('text-sm text-red-600', className)} {...rest}>
      {children}
    </p>
  )
}

export default FieldErrorMessage
