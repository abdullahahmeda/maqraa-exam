'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '~/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '~/components/ui/tooltip'
import { AlertTriangleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ReportErrorDialog } from '~/components/modals/report-error'
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { QuestionCard, QuestionCardText } from '~/components/ui/question-card'
import type { Selectable } from 'kysely'
import type { Quiz } from '~/kysely/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'

type FieldValues = {
  id: string
  answers: Record<string, string>
}

export const QuizForm = ({
  quiz,
}: {
  quiz: Selectable<Quiz> & { systemExamName: string | null; questions: any[] }
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const router = useRouter()
  const form = useForm<FieldValues>()

  const [errorReportData, setErrorReportData] = useState<{
    quizId: string
    questionId: string
  } | null>(null)

  const quizSubmit = api.quiz.submit.useMutation({
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: FieldValues) => {
    for (const answer of Object.values(data.answers)) {
      if ([undefined, ''].includes(answer))
        return setConfirmationDialogOpen(true)
    }
    submitForm()
  }

  const submitForm = () => {
    quizSubmit.mutate({
      id: quiz.id,
      answers: form.getValues('answers'),
    })
  }

  return (
    <>
      <AlertDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لديك بعض الأسئلة التي لم تقم بإجابتها
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={submitForm}>تسليم</AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className='container mx-auto py-4'>
        <div className='rounded-md bg-gray-50 p-4 border'>
          <Dialog
            open={errorReportData !== null}
            onOpenChange={(open) =>
              setErrorReportData(open ? errorReportData : null)
            }
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-4'>
                  {quiz.questions.map(
                    ({ id, order, userAnswer, weight, style, ...question }) => (
                      <div className='flex gap-2' key={id}>
                        <div className='text-center'>
                          <p>{order}) </p>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='mt-2'
                                  onClick={() =>
                                    setErrorReportData({
                                      quizId: quiz.id,
                                      questionId: id,
                                    })
                                  }
                                  type='button'
                                >
                                  <AlertTriangleIcon className='h-4 w-4 text-orange-600' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>الإبلاغ عن خطأ</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <QuestionCard className='flex-1'>
                          <QuestionCardText text={question.text} />
                          {question.type === 'WRITTEN' ? (
                            <FormField
                              control={form.control}
                              name={`answers.${id}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الإجابة</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <FormField
                              control={form.control}
                              name={`answers.${id}`}
                              render={({ field: { value, onChange } }) => (
                                <FormItem>
                                  <FormLabel>اختر الإجابة</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      value={value}
                                      onValueChange={onChange}
                                      className='space-y-1'
                                      dir='rtl'
                                    >
                                      {style?.choicesColumns.map((column) => {
                                        const value = question[
                                          column as keyof typeof question
                                        ] as string
                                        return (
                                          <FormItem
                                            className='flex items-center gap-2 space-y-0'
                                            key={value}
                                          >
                                            <FormControl>
                                              <RadioGroupItem value={value} />
                                            </FormControl>
                                            <FormLabel>{value}</FormLabel>
                                          </FormItem>
                                        )
                                      })}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </QuestionCard>
                      </div>
                    ),
                  )}
                </div>
                <Button
                  loading={quizSubmit.isPending}
                  className='mt-4'
                  size='lg'
                >
                  تسليم
                </Button>
              </form>
            </Form>
            <DialogContent>
              <ReportErrorDialog
                data={errorReportData}
                closeDialog={() => setErrorReportData(null)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
