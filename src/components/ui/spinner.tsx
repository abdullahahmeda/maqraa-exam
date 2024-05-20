import { Loader2Icon, type LucideProps } from 'lucide-react'
import { cn } from '~/lib/utils'

export type SpinnerProps = LucideProps

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return <Loader2Icon className={cn('animate-spin', className)} {...props} />
}
