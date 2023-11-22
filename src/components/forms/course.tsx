import { UseFormReturn } from 'react-hook-form'
import { Button } from '../ui/button'
import { DialogFooter } from '../ui/dialog'
import {
  FormItem,
  Form,
  FormControl,
  FormMessage,
  FormLabel,
  FormField,
} from '../ui/form'
import { Input } from '../ui/input'

export type NewCourseFieldValues = { name: string }
export type EditCourseFieldValues = NewCourseFieldValues & { id: string }
// type FieldValues = CreateFieldValues | UpdateFieldValues

type FormProps = {
  form: UseFormReturn<NewCourseFieldValues | EditCourseFieldValues>
  onSubmit: (data: NewCourseFieldValues | EditCourseFieldValues) => void
  isLoading?: boolean
  submitText: string
}

export const CourseForm = ({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: FormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المقرر</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
