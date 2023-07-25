import { Course, Track } from '@prisma/client'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { api } from '~/utils/api'
import {
  FormField,
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
} from '../ui/form'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { DialogFooter } from '../ui/dialog'
import { Trash } from 'lucide-react'
import { Combobox } from '../ui/combobox'

export type AddCurriculumFieldValues = {
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
export type EditCurriculumFieldValues = AddCurriculumFieldValues & {
  id: string
}

type FormProps = {
  form: UseFormReturn<AddCurriculumFieldValues | EditCurriculumFieldValues>
  onSubmit: (data: AddCurriculumFieldValues | EditCurriculumFieldValues) => void
  isLoading?: boolean
  submitText: string
}

export const CurriculumForm = ({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: FormProps) => {
  const { data: tracks, isLoading: isTracksLoading } =
    api.tracks.findMany.useQuery<any, (Track & { course: Course })[]>({
      include: { course: true },
    })
  const {
    fields: parts,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'parts',
  })
  const appendPart = () => {
    append({
      name: '',
      number: '',
      from: '',
      to: '',
      mid: '',
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='trackId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المقرر</FormLabel>
              <FormControl>
                <Combobox
                  items={
                    tracks?.map((t) => ({
                      ...t,
                      name: `${t.course.name}: ${t.name}`,
                    })) || []
                  }
                  loading={isTracksLoading}
                  value={field.value}
                  labelKey='name'
                  valueKey='id'
                  onSelect={field.onChange}
                  triggerText='اختر المقرر'
                  triggerClassName='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
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
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name={`parts.${index}.name`}
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
                control={form.control}
                name={`parts.${index}.number`}
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
                  control={form.control}
                  name={`parts.${index}.from`}
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
                  control={form.control}
                  name={`parts.${index}.to`}
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
                control={form.control}
                name={`parts.${index}.mid`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نصف المنهج حتى الحديث (المحور الأول)</FormLabel>
                    <FormControl>
                      <Input type='number' min={1} {...field} />
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
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        ))}
        <Button type='button' onClick={appendPart}>
          إضافة جزء آخر
        </Button>
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
