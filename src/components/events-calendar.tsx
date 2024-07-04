import { type DayContentProps } from 'react-day-picker'
import { Calendar } from './ui/calendar'
import { isSameDay } from 'date-fns'

export type CalendarEvent = {
  date: Date
  title: string
}

function DayContent({
  date,
  event,
}: DayContentProps & { event?: CalendarEvent | undefined }) {
  return (
    <div>
      <span>{date.getDate()}</span>
      {event && <p>{event.title}</p>}
    </div>
  )
}

export type EventsCalendarProps = { events: CalendarEvent[] }

export const EventsCalendar = ({ events }: EventsCalendarProps) => {
  return (
    <Calendar
      components={{
        DayContent: (props) => (
          <DayContent
            {...props}
            event={events.find((e) => isSameDay(e.date, props.date))}
          />
        ),
      }}
      classNames={{
        month: 'space-y-4 w-full',
        head_cell:
          'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]',
        cell: 'h-20 flex-1 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: 'w-full h-full flex justify-center items-center rounded-md whitespace-pre-wrap',
      }}
      fromDate={events[0]?.date}
      toDate={events.at(-1)?.date}
    />
  )
}
