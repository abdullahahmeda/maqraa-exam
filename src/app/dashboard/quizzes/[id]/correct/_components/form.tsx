'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type ControllerRenderProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { compareTwoStrings } from 'string-similarity'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { type QuestionType } from '~/kysely/enums'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { percentage } from '~/utils/percentage'
import { normalizeText } from '~/utils/strings'
import { correctQuizSchema } from '~/validation/correctQuizSchema'

type FieldValues = {
  id: string
  answers: Record<string, number>
  examinee: { id: string } | null
}

const WrittenQuestionCorrector = ({
  weight,
  field,
}: {
  weight: number
  field: ControllerRenderProps<FieldValues, `answers.${string}`>
}) => {
  return (
    <FormItem className='mt-3'>
      <div className='flex items-center gap-2'>
        <FormLabel>الدرجة</FormLabel>
        <div className='flex'>
          <FormControl>
            <Input
              className='w-20 rounded-e-none'
              type='number'
              {...field}
              max={weight}
              min={0}
            />
          </FormControl>
          <span className='flex items-center justify-center rounded-e bg-gray-100 px-2'>
            {weight}
          </span>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  )
}

const MCQQuestionCorrector = ({
  weight,
  field,
}: {
  weight: number
  field: ControllerRenderProps<FieldValues, `answers.${string}`>
}) => {
  return (
    <FormItem className='mt-3'>
      <div className='flex items-center gap-2'>
        <FormControl>
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked ? weight : 0)}
          />
        </FormControl>
        <FormLabel>إجابة صحيحة</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )
}

export const CorrectQuizForm = ({
  quiz,
}: {
  quiz: {
    id: string
    answers: {
      id: string
      grade: number | null
      order: number
      correctAnswer: string
      examineeAnswer: string | null
      text: string
      style: string
      weight: number
      type: QuestionType
      errorReport: {
        note: string
      } | null
    }[]
    correctorId: string | null
    total: number
    correctedAt: Date | null
    grade: number | null
  }
}) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(correctQuizSchema),
    defaultValues: {
      id: quiz.id,
      answers: quiz.answers.reduce(
        (questionAcc, question) => ({
          ...questionAcc,
          [question.id]: question.grade,
        }),
        {},
      ),
    },
  })

  const correctQuiz = api.quiz.correct.useMutation({
    onSuccess: () => {
      toast.success('تم تصحيح الاختبار وحفظ الدرجة')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: FieldValues) => {
    correctQuiz.mutate({
      id: quiz.id,
      answers: data.answers,
    })
  }

  const isOfficiallyCorrected = !!quiz.correctorId

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className='mb-4 inline-block text-center text-xl font-bold'>
          الأسئلة
        </h2>
        <Badge
          className='sticky top-20 float-left mr-auto mt-1 border'
          // variant={exam?.grade !== null ? 'primary' : 'warning'}
        >
          {quiz.correctedAt ? 'تم التصحيح - ' : 'لم يتم التصحيح - '}
          {quiz.grade} من {quiz.total} ({percentage(quiz.grade!, quiz.total)}%)
        </Badge>
        <div>
          {quiz.answers.map(
            ({ id, grade, order, correctAnswer, weight, ...question }) => (
              <div
                key={id}
                className={cn('mb-3 rounded-md px-4 py-3', {
                  'bg-green-200':
                    grade === weight &&
                    (question.type === 'MCQ' || isOfficiallyCorrected),
                  'bg-red-200':
                    grade === 0 &&
                    (question.type === 'MCQ' || isOfficiallyCorrected),
                  'bg-slate-200':
                    !isOfficiallyCorrected && question.type === 'WRITTEN',
                })}
              >
                <div className='flex items-center'>
                  {order}.<Badge className='ml-2 mr-1'>{question.style}</Badge>
                  <p>{question.text}</p>
                </div>
                <p
                  className={cn(
                    correctAnswer === question.examineeAnswer! &&
                      'text-green-600',
                    question.type === 'MCQ' &&
                      correctAnswer !== question.examineeAnswer! &&
                      'text-red-500',
                  )}
                >
                  {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                  إجابة الطالب: {question.examineeAnswer || '(لا يوجد إجابة)'}
                </p>
                <p>الإجابة الصحيحة: {correctAnswer}</p>
                {question.type === 'WRITTEN' && (
                  <p>
                    نسبة التطابق مع الإجابة الصحيحة:{' '}
                    {(
                      compareTwoStrings(
                        normalizeText(question.examineeAnswer ?? ''),
                        normalizeText('' + correctAnswer),
                      ) * 100
                    ).toFixed(2)}
                    %
                  </p>
                )}
                <FormField
                  control={form.control}
                  name={`answers.${id}`}
                  render={({ field }) =>
                    question.type === 'MCQ' ? (
                      <MCQQuestionCorrector field={field} weight={weight} />
                    ) : (
                      <WrittenQuestionCorrector field={field} weight={weight} />
                    )
                  }
                />
                {question.errorReport && (
                  <div className='mt-2'>
                    <p>
                      <span className='font-semibold'>
                        تم الإبلاغ عن هذا السؤال:
                      </span>{' '}
                      {question.errorReport.note}
                    </p>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
        <Button className='mt-2' type='submit' loading={correctQuiz.isPending}>
          حفظ
        </Button>
      </form>
    </Form>
  )
}
