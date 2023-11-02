import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { ActiveModifiers, DayPickerSingleProps } from 'react-day-picker'
import { format } from 'date-fns'
import { useState } from 'react'

type Props = DayPickerSingleProps & { placeholder?: string }

export const DatePicker = ({
  selected,
  placeholder,
  onSelect,
  ...props
}: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
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
        <Calendar
          initialFocus
          selected={selected}
          onSelect={(
            day: Date | undefined,
            selectedDay: Date,
            activeModifiers: ActiveModifiers,
            e: any
          ) => {
            if (onSelect) {
              onSelect(day, selectedDay, activeModifiers, e)
              setOpen(false)
            }
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
