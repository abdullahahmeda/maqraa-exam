'use client'

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { XIcon } from 'lucide-react'

export const WrongAnswerIcon = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <XIcon className='text-red-500' />
        </TooltipTrigger>
        <TooltipContent>
          <p>إجابة خاطئة</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
