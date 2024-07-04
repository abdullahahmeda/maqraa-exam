'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { eachDayOfInterval, getDay } from 'date-fns'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
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
import { EventsCalendar } from '~/components/events-calendar'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { CalendarIcon, TableIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

type FieldValues = {
  fromDate: Date
  toDate: Date
  memorizationDays: string[]
  revisionDays: string[]
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
  memorizationDays: z.array(z.string()).min(1),
  revisionDays: z.array(z.string()),
  curriculum: z.string(),
})

export const MnahgForm = () => {
  const [events, setEvents] = useState<
    { date: Date; revision: null | number; memorization: number }[]
  >([])
  const form = useForm<FieldValues>({
    defaultValues: {
      memorizationDays: ['0', '1', '2', '3', '4'],
      revisionDays: [],
    },
    resolver: zodResolver(formSchema),
  })

  const fromDate = useWatch({ control: form.control, name: 'fromDate' })
  const toDate = useWatch({ control: form.control, name: 'toDate' })
  const revisionDays = useWatch({ control: form.control, name: 'revisionDays' })

  const onSubmit = (data: FieldValues) => {
    const totalLines = 100
    const allDays = Array.from(
      new Set([...data.memorizationDays, ...data.revisionDays]),
    )
    const days = eachDayOfInterval({
      start: data.fromDate,
      end: data.toDate,
    }).filter((d) => allDays.includes('' + getDay(d)))

    if (days.length === 0) throw new Error()

    // Lines per day
    const lpd = Math.floor(totalLines / days.length)
    const events = []
    let linesRemaining = totalLines % days.length

    let lastMemorizationLines = 0
    for (const [index, day] of days.entries()) {
      let dayLines = lpd
      let memorization = 0
      let revision = 0
      if (data.memorizationDays.includes('' + getDay(day))) {
        if (linesRemaining > 0) {
          dayLines += 1
          linesRemaining -= 1
        }
        lastMemorizationLines += dayLines
        memorization = dayLines
      }
      if (data.revisionDays.includes('' + getDay(day))) {
        if (lastMemorizationLines > 0) {
          revision = lastMemorizationLines
          lastMemorizationLines = 0
        } else {
          // revision = 'لا يوجد حفظ لمراجعته'
        }
      }
      events.push({ date: day, memorization, revision })
    }
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
              <FormItem className='flex flex-col flex-1 gap-1'>
                <FormLabel>تاريخ بداية الخطة</FormLabel>
                <FormControl>
                  <DatePicker
                    mode='single'
                    toDate={toDate}
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
              <FormItem className='flex flex-col flex-1 gap-1'>
                <FormLabel>تاريخ نهاية الخطة</FormLabel>
                <FormControl>
                  <DatePicker
                    mode='single'
                    fromDate={fromDate}
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
          name='memorizationDays'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الأيام المتاحة للحفظ</FormLabel>
              <div className='flex flex-wrap gap-4'>
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
          name='revisionDays'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الأيام المتاحة للمراجعة</FormLabel>
              <div className='flex flex-wrap gap-4'>
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
        {events.length > 0 && (
          <Tabs defaultValue='calendar'>
            <TabsList>
              <TabsTrigger value='calendar'>
                <CalendarIcon className='w-4 h-4 ml-2' />
                عرض كتقويم
              </TabsTrigger>
              <TabsTrigger value='table'>
                <TableIcon className='w-4 h-4 ml-2' />
                عرض كجدول
              </TabsTrigger>
            </TabsList>
            <TabsContent value='calendar'>
              <EventsCalendar
                events={events.map((e) => ({
                  ...e,
                  title: `الحفظ: ${
                    e.memorization === 0 ? '-' : `حفظ ${e.memorization} سطر`
                  }
المراجعة: ${e.revision === 0 ? '-' : `مراجعة ${e.revision} سطر`}`,
                }))}
              />
            </TabsContent>
            <TabsContent value='table'>
              <Table className='border border-collapse'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='border'>اليوم</TableHead>
                    <TableHead className='border'>الحفظ</TableHead>
                    {revisionDays.length > 0 && (
                      <TableHead className='border'>المراجعة</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.date.toISOString()}>
                      <TableCell className='border'>
                        {days[`${getDay(event.date)}`]}
                      </TableCell>
                      <TableCell className='border'>
                        {event.memorization === 0
                          ? '-'
                          : `حفظ ${event.memorization} سطر`}
                      </TableCell>
                      {revisionDays.length > 0 && (
                        <TableCell className='border'>
                          {event.revision === 0
                            ? '-'
                            : `مراجعة ${event.revision} سطر`}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        )}
      </form>
    </Form>
  )
}
