import { api } from '~/trpc/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { editQuizSchema } from '~/validation/editQuizSchema'
import { DatePicker } from '~/components/ui/date-picker'

type FieldValues = {
  id: string
  endsAt: Date | null | undefined
  repeatFromSameHadith: CheckedState
}

export const EditQuizDialog = ({
  id,
  setDialogOpen,
}: {
  id: string
  setDialogOpen: (state: boolean) => void
}) => {
  const utils = api.useUtils()
  const form = useForm<FieldValues>({
    resolver: zodResolver(editQuizSchema),
    defaultValues: { repeatFromSameHadith: false },
  })

  const mutation = api.quiz.update.useMutation()

  const { data: quiz, isLoading, error } = api.quiz.get.useQuery(id)

  useEffect(() => {
    if (quiz) form.reset(quiz)
  }, [quiz, form])

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2Icon className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  const onSubmit = (data: FieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof editQuizSchema>)
      .then(() => {
        setDialogOpen(false)
        toast.success('تم تعديل الإختبار بنجاح')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.quiz.invalidate()
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <input type='hidden' {...form.register('id', { value: id })} />
        <FormField
          control={form.control}
          name='endsAt'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>تاريخ قفل الإختبار</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={(date: Date) => date < new Date()}
                  mode='single'
                />
              </FormControl>
              <FormDescription>
                اتركه فارعاً إن كان الإختبار مفتوح. قم باختيار نفس التاريخ
                لإزالة الاختيار
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
