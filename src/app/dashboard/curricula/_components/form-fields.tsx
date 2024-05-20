'use client'

import { type Selectable } from 'kysely'
import { PlusIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import {
  type FieldValues,
  type Control,
  type FieldPath,
  type ArrayPath,
  useFieldArray,
} from 'react-hook-form'
import { Button, buttonVariants } from '~/components/ui/button'
import { Combobox } from '~/components/ui/combobox'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import type { Course, Track } from '~/kysely/types'

export type NewCurriculumFieldValues = {
  trackId: string
  name: string
  parts: {
    name: string
    number: number | string
    from: number | string
    to: number | string
    mid: number | string
  }[]
}
export type EditCurriculumFieldValues = NewCurriculumFieldValues & {
  id: string
}

type FormProps<T extends FieldValues> = {
  control: Control<T>
  tracks: (Selectable<Track> & { course: Selectable<Course> | null })[]
}

export const CurriculumFormFields = <T extends FieldValues>({
  control,
  tracks,
}: FormProps<T>) => {
  const {
    fields: parts,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'parts' as ArrayPath<T>,
  })
  const appendPart = () => {
    append({
      // TODO: check this error
      // @ts-expect-error Ignore this for now
      name: '',
      number: '',
      from: '',
      to: '',
      mid: '',
    })
  }

  return (
    <>
      <FormField
        control={control}
        name={'trackId' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <div className='flex gap-2'>
              <FormControl className='flex-1'>
                <Combobox
                  items={
                    tracks?.map((t) => ({
                      ...t,
                      name: `${t.course?.name}: ${t.name}`,
                    })) || []
                  }
                  value={field.value}
                  labelKey='name'
                  valueKey='id'
                  onSelect={field.onChange}
                  triggerText='اختر المقرر'
                  triggerClassName='w-full'
                  containerClassName='flex-1'
                />
              </FormControl>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/dashboard/courses/new'
                      className={buttonVariants({
                        variant: 'secondary',
                        size: 'icon',
                      })}
                    >
                      <PlusIcon className='h-4 w-4' />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إضافة مقرر</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormDescription>
              إذا لم تظهر المقررات الجديدة قم بإعادة تحميل الصفحة
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الاسم</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <h3 className='font-semibold'>التقسيمات</h3>
      {parts.map(({ id }, index) => (
        <div className='flex gap-4' key={id}>
          <div className='space-y-2 flex-1'>
            <FormField
              control={control}
              name={`parts.${index}.name` as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الجزء أو المجلد</FormLabel>
                  <FormControl>
                    <Input placeholder='مثال: الجزء الأول' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`parts.${index}.number` as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الجزء</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={control}
                name={`parts.${index}.from` as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>من الحديث رقم</FormLabel>
                    <FormControl>
                      <Input type='number' min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`parts.${index}.to` as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>إلى الحديث رقم</FormLabel>
                    <FormControl>
                      <Input type='number' min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`parts.${index}.mid` as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نصف المنهج حتى الحديث (المحور الأول)</FormLabel>
                  <FormControl>
                    <Input type='number' min={0} {...field} />
                  </FormControl>
                  <FormDescription>
                    قم بوضعها 0 إذا كان هذا الجزء بالكامل خاص بالمحور الثاني
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator orientation='vertical' className='h-auto' />
          <Button
            size='icon'
            variant='destructive'
            type='button'
            onClick={() => remove(index)}
            className='flex-shrink-0 self-center'
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button type='button' variant='outline' onClick={appendPart}>
        إضافة جزء آخر
      </Button>
    </>
  )
}
