import { api } from '~/utils/api'
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
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

import { newSystemExamSchema } from '~/validation/newSystemExamSchema'
import { z } from 'zod'

import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '~/lib/utils'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { arSA } from 'date-fns/locale'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { editQuizSchema } from '~/validation/editQuizSchema'

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
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<FieldValues>({
    resolver: zodResolver(editQuizSchema),
    defaultValues: { repeatFromSameHadith: false },
  })

  const quizUpdate = api.updateQuiz.useMutation()

  const {
    data: quiz,
    isLoading,
    error,
  } = api.quiz.findFirst.useQuery({
    where: { id },
  })

  useEffect(() => {
    if (quiz) form.reset(quiz)
  }, [quiz, form])

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  const onSubmit = (data: FieldValues) => {
    quizUpdate
      .mutateAsync(data as z.infer<typeof editQuizSchema>)
      .then(() => {
        toast({ title: 'تم تعديل الإختبار بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        if (error.message) {
          toast({
            title: 'حدث خطأ',
            description: error.message,
          })
        } else
          toast({
            title: 'حدث خطأ غير متوقع',
          })
      })
      .finally(() => {
        queryClient.invalidateQueries([['quiz']])
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'pl-3 text-right font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'dd MMMM yyyy hh:mm a')
                      ) : (
                        <span>اختر التاريخ</span>
                      )}
                      <CalendarIcon className='mr-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value || undefined}
                    locale={arSA}
                    onSelect={field.onChange}
                    disabled={(date: Date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                اتركه فارعاً إن كان الإختبار مفتوح. قم باختيار نفس التاريخ
                لإزالة الاختيار
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='repeatFromSameHadith'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 space-x-reverse'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>السماح بأكثر من سؤال في نفس الحديث</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <p>أقصى عدد للأسئلة في الإختبار: 25، مجموع الدرجات يجب أن يساوي 100</p>
        <Button>تعديل</Button>
      </form>
    </Form>
  )
}
