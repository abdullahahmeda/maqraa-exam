'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { eachDayOfInterval, getDay } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Checkbox } from '~/components/ui/checkbox'
import { DatePicker } from '~/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { CalendarEvent, EventsCalendar } from '~/components/events-calendar'
import { useState } from 'react'

type FieldValues = {
  fromDate: Date
  toDate: Date
  days: string[]
  curriculum: string
}

const days = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

const formSchema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  days: z.array(z.string()).min(1),
  curriculum: z.string(),
})

export const MnahgForm = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const form = useForm<FieldValues>({
    defaultValues: {
      days: ['0', '1', '2', '3', '4'],
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FieldValues) => {
    const totalLines = 100
    const days = eachDayOfInterval({
      start: data.fromDate,
      end: data.toDate,
    }).filter((d) => data.days.includes('' + getDay(d)))

    if (days.length === 0) throw new Error()

    // Lines per day
    const lpd = Math.floor(totalLines / days.length)
    const events = []
    let linesRemaining = totalLines % days.length

    for (const day of days) {
      let dayLines = lpd
      if (linesRemaining > 0) {
        dayLines += 1
        linesRemaining -= 1
      }
      events.push({ date: day, title: `حفظ ${dayLines} سطر` })
    }
    // console.log(linesRemaining, events)
    setEvents(events)
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='fromDate'
            render={({ field }) => (
              <FormItem className='flex-1 flex flex-col gap-1'>
                <FormLabel>من</FormLabel>
                <FormControl>
                  <DatePicker
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='toDate'
            render={({ field }) => (
              <FormItem className='flex-1 flex flex-col gap-1'>
                <FormLabel>إلى</FormLabel>
                <FormControl>
                  <DatePicker
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='days'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الأيام المتاحة للحفظ</FormLabel>
              <div className='flex gap-4 flex-wrap'>
                {days.map((day, index) => (
                  <FormItem
                    key={index}
                    className='flex flex-row items-start gap-1 space-y-0'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('' + index)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, '' + index])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== '' + index,
                                ),
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className='font-normal'>{day}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='curriculum'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المنهج</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='1'>
                    الجمع بين الصحيحين: المجلد كامل
                  </SelectItem>
                  <SelectItem value='2'>بلوغ المرام كامل</SelectItem>
                  <SelectItem value='3'>الأربعين النووية</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>إنشاء نظام المنهج</Button>
        {events.length > 0 && <EventsCalendar events={events} />}
      </form>
    </Form>
  )
}
