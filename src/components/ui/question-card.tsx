import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { CheckIcon, XIcon } from 'lucide-react'

export const QuestionCard = ({
  children,
  className,
  isCorrect,
}: {
  children: ReactNode
  className?: string
  isCorrect?: boolean
}) => {
  const showAnswerFeedback = typeof isCorrect === 'boolean'

  return (
    <div className={cn('flex flex-col gap-2 md:flex-row', className)}>
      <div
        className={cn(
          'relative flex-1 rounded-md bg-white p-4 border',
          showAnswerFeedback && {
            'bg-green-100': isCorrect,
            'bg-red-50': !isCorrect,
          },
        )}
      >
        {showAnswerFeedback && (
          <div className='absolute left-0 top-0'>
            {isCorrect ? (
              <CheckIcon className='h-16 w-16 text-green-800 opacity-25' />
            ) : (
              <XIcon className='h-16 w-16 text-red-800 opacity-25' />
            )}
          </div>
        )}
        <div className='space-y-2'>{children}</div>
      </div>
    </div>
  )
}

export const QuestionCardText = ({ text }: { text: string }) => {
  return <p className='[overflow-wrap:anywhere]'>{text}</p>
}
