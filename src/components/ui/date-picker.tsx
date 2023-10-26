import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { DayPickerSingleProps } from 'react-day-picker'
import { format } from 'date-fns'

type Props = DayPickerSingleProps & { placeholder?: string }

export const DatePicker = ({ selected, placeholder, ...props }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'pl-4 text-right font-normal',
            !selected && 'text-muted-foreground'
          )}
        >
          {selected ? (
            format(selected, 'dd MMMM yyyy hh:mm a')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='mr-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar initialFocus selected={selected} {...props} />
      </PopoverContent>
    </Popover>
  )
}
