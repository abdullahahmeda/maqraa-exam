'use client'

import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { DayPickerSingleProps, Modifiers, PropsBase as DayPickerBaseProps } from 'react-day-picker'
import { format } from 'date-fns'
import { type MouseEvent as ReactMouseEvent, type KeyboardEvent as ReactKeyboardEvent, useState } from 'react'
import { arSA } from 'date-fns/locale'

type Props = DayPickerSingleProps & Pick<DayPickerBaseProps, 'disabled' | 'locale'> & { placeholder?: string }

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
            !selected && 'text-muted-foreground',
          )}
        >
          {selected ? (
            format(selected, 'dd MMMM yyyy hh:mm a', { locale: arSA })
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='mr-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          selected={selected}
          onSelect={(
            day: Date | undefined,
            selectedDay: Date,
            activeModifiers: Modifiers,
            e: ReactMouseEvent | ReactKeyboardEvent,
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
