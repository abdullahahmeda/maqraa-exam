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
import { toast } from 'sonner'
import { api } from '~/utils/api'
import { DialogHeader } from '../ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Loader2Icon } from 'lucide-react'

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
  const utils = api.useUtils()
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

  const mutation = api.errorReport.create.useMutation()

  const onSubmit = (data: FieldValues) => {
    const promise = mutation
      .mutateAsync({
        ...data,
        modelQuestionId: modelQuestionId,
      })
      .then(() => {
        closeDialog()
      })
      .finally(() => {
        utils.errorReport.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري الإبلاغ عن الخطأ...',
      success: 'تم الإبلاغ عن الخطأ بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        الإبلاغ عن خطأ
      </DialogHeader>
      {isLoading && (
        <div className='flex justify-center'>
          <Loader2Icon className='animate-spin' />
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
                {/* @ts-expect-error TODO: fix this type */}
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
            <Button loading={mutation.isPending}>إبلاغ</Button>
          </form>
        </Form>
      )}
    </>
  )
}
