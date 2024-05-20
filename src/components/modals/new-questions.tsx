import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/trpc/react'
import { importQuestionsSchema } from '~/validation/importQuestionsSchema'
import {
  ImportQuestionsFieldValues,
  ImportQuestionsForm,
} from '../forms/import-questions'
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
} from '../ui/dialog'
import { NewQuestionStyleDialog } from './new-question-style'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { NewCourseDialog } from './new-course'
import { Separator } from '../ui/separator'

export const NewQuestionsDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<ImportQuestionsFieldValues>({
    resolver: zodResolver(importQuestionsSchema),
  })

  const utils = api.useUtils()

  const questionsImport = api.question.import.useMutation()

  const onSubmit = (data: ImportQuestionsFieldValues) => {
    const promise = questionsImport
      .mutateAsync(data as z.infer<typeof importQuestionsSchema>)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.question.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري إضافة الأسئلة...',
      success: 'تم إضافة الأسئلة بنجاح',
      error: (error) => error.message,
    })
  }

  const [newQStyleOpen, setNewQStyleOpen] = useState(false)
  const [newCourseOpen, setNewCourseOpen] = useState(false)

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة أسئلة
      </DialogHeader>
      <ImportQuestionsForm
        form={form}
        isLoading={questionsImport.isPending}
        onSubmit={onSubmit}
      />
      <Separator className='my-4' />
      <div className='flex gap-4'>
        <Dialog open={newQStyleOpen} onOpenChange={setNewQStyleOpen}>
          <DialogTrigger asChild>
            <Button variant='secondary'>
              <PlusIcon className='ml-2' size={20} />
              إضافة نوع سؤال جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewQuestionStyleDialog setDialogOpen={setNewQStyleOpen} />
          </DialogContent>
        </Dialog>
        <Dialog open={newCourseOpen} onOpenChange={setNewCourseOpen}>
          <DialogTrigger asChild>
            <Button variant='secondary'>
              <PlusIcon className='ml-2' size={20} />
              إضافة نوع مقرر جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewCourseDialog setDialogOpen={setNewCourseOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
