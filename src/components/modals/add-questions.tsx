import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/utils/api'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import {
  ImportQuestionsFieldValues,
  ImportQuestionsForm,
} from '../forms/import-questions'
import { DialogHeader } from '../ui/dialog'
import { useToast } from '../ui/use-toast'

export const AddQuestionsDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<ImportQuestionsFieldValues>({
    resolver: zodResolver(importQuestionsSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const questionsImport = api.importQuestions.useMutation()

  const onSubmit = (data: ImportQuestionsFieldValues) => {
    const t = toast({ title: 'جاري إضافة الأسئلة' })
    questionsImport
      .mutateAsync(data as z.infer<typeof importQuestionsSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة الأسئلة بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['question']])
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة أسئلة
      </DialogHeader>
      <ImportQuestionsForm
        form={form}
        isLoading={questionsImport.isLoading}
        onSubmit={onSubmit}
      />
    </>
  )
}
