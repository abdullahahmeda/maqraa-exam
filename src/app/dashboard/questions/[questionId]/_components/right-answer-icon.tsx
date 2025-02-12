'use client'

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { CheckIcon } from 'lucide-react'

export const RightAnswerIcon = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckIcon className='text-green-600' />
        </TooltipTrigger>
        <TooltipContent>
          <p>إجابة صحيحة</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
