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
import { Input } from '../ui/input'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { UseFormReturn } from 'react-hook-form'
import { api } from '~/utils/api'

export type NewTrackFieldValues = { name: string; courseId: string }

type FormProps = {
  form: UseFormReturn<NewTrackFieldValues>
  onSubmit: (data: NewTrackFieldValues) => void
  isLoading?: boolean
}

export const TrackForm = ({ form, onSubmit, isLoading }: FormProps) => {
  const { data: courses, isLoading: isCoursesLoading } =
    api.course.list.useQuery({})

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المسار</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='courseId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المقرر</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCoursesLoading}
                  >
                    <SelectValue placeholder='اختر المقرر' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type='submit'
            // variant='success'
            loading={isLoading}
          >
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
