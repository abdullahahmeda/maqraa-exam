'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useRouter, useParams } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Combobox } from '~/components/ui/combobox'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { addStudentToExamSchema } from '~/validation/backend/mutations/exam/addStudentToExam'

type FieldValues = {
  examId: string
  userId: string
}

export default function AddStudent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const form = useForm<FieldValues>({
    resolver: zodResolver(addStudentToExamSchema)
  })
  const utils = api.useUtils()
  const examId = params.id

  const { data: students } = api.user.list.useQuery({
    filters: {
      role: 'STUDENT'
    }
  })

  const mutation = api.exam.addStudentToExam.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة الطالب للإختبار بنجاح')
      void utils.quiz.invalidate()
      router.back()
  }
  })

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open onOpenChange={open => {
      if (!open) router.back()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة طالب للإختبار</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input type='hidden' {...form.register('examId', { value: examId })} />
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الطالب</FormLabel>
                  <FormControl>
                    <Combobox
                      items={students?.data ?? []}
                      labelKey='name'
                      valueKey='id'
                      value={field.value}
                      onSelect={field.onChange}
                      triggerText='اختر'
                      triggerClassName='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4'>إضافة</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

