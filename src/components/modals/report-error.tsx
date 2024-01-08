import { useQueryClient } from '@tanstack/react-query'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportErrorSchema } from '~/validation/reportErrorSchema'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { api } from '~/utils/api'
import { DialogHeader } from '../ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Loader2 } from 'lucide-react'

type FieldValues = {
  modelQuestionId: string
  name: string
  email: string
  note: string
}

export const ReportErrorDialog = ({
  closeDialog,
  questionId: modelQuestionId,
}: {
  closeDialog: () => void
  questionId: string
}) => {
  const queryClient = useQueryClient()
  const form = useForm<FieldValues>({
    resolver: zodResolver(reportErrorSchema),
  })

  const {
    data: modelQuestion,
    isLoading,
    error,
  } = api.modelQuestion.get.useQuery({
    id: modelQuestionId,
    include: { question: true },
  })

  const errorReport = api.errorReport.create.useMutation()

  const { toast } = useToast()

  const onSubmit = (data: FieldValues) => {
    const t = toast({ title: 'جاري الإبلاغ عن الخطأ' })
    errorReport
      .mutateAsync({
        ...data,
        modelQuestionId: modelQuestionId,
      })
      .then(() => {
        t.dismiss()
        toast({ title: 'تم الإبلاغ عن الخطأ بنجاح' })
        closeDialog()
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['errorReport']])
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        الإبلاغ عن خطأ
      </DialogHeader>
      {isLoading && (
        <div className='flex justify-center'>
          <Loader2 className='animate-spin' />
        </div>
      )}
      {!!error && (
        <p className='text-center text-red-600'>{error.message || 'حدث خطأ'}</p>
      )}
      {!!modelQuestion && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <input
              type='hidden'
              {...form.register('modelQuestionId')}
              value={modelQuestionId}
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
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>السؤال</FormLabel>
              <FormControl>
                <Textarea disabled value={modelQuestion?.question.text} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الملاحظة</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>إبلاغ</Button>
          </form>
        </Form>
      )}
    </>
  )
}
