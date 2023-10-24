import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { compareTwoStrings } from 'string-similarity'
import { Button } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import { QuestionType } from '~/constants'
import { api } from '~/utils/api'
import { percentage } from '~/utils/percentage'
import { enStyleToAr } from '~/utils/questions'
import { correctQuestion, normalizeText } from '~/utils/strings'
import { Badge } from '~/components/ui/badge'
import { User, UserRole } from '@prisma/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { prisma as _prisma } from '~/server/db'
import { enhance } from '@zenstackhq/runtime'
import { getServerAuthSession } from '~/server/auth'
import { formatDate } from '~/utils/formatDate'
import { zodResolver } from '@hookform/resolvers/zod'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { useToast } from '~/components/ui/use-toast'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'

type FieldValues = {
  id: string
  questions: Record<string, number>
  examinee: User | null
}

const WrittenQuestionCorrector = ({ grade, weight, field }: any) => {
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

const MCQQuestionCorrector = ({ weight, field }: any) => {
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

const CorrectQuizPage = ({
  quiz,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(correctQuizSchema),
  })
  const router = useRouter()

  const examCorrect = api.correctExam.useMutation()
  // const gradeEmailSend = api.emails.sendGradeEmail.useMutation()

  useEffect(() => {
    if (quiz) {
      form.reset({
        id: quiz.id,
        questions: quiz.questions.reduce(
          (questionAcc, question) => ({
            ...questionAcc,
            [question.id]: question.grade,
          }),
          {}
        ),
      })
    }
  }, [quiz, form])

  // const isLoading = _isLoading || isPaused

  const onSubmit = (data: FieldValues) => {
    examCorrect
      .mutateAsync({
        id: quiz.id,
        questions: form.getValues('questions') as any,
      })
      .then(() => {
        const isEmailSent = false
        if (isEmailSent) {
          // toast({ title: 'تم حفظ الاختبار وارسال الدرجة بنجاح' })
        }
        // TODO: fix this toast
        else 'nothing'
        toast({ title: 'تم حفظ الاختبار' })
        // router.push('/dashboard/exams')
      })
      .catch((error: any) => {
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  return (
    <>
      <Head>
        <title>تصحيح اختبار</title>
      </Head>

      <div className='space-y-4'>
        {quiz.submittedAt ? (
          <>
            <div className='space-y-2 rounded-md bg-white p-4 shadow'>
              <h2 className='text-xl font-bold'>معلومات عن الإختبار</h2>

              <div>
                <p>وقت فتح الإختبار: {formatDate(quiz.createdAt)}</p>
                <p>
                  وقت غلق الإختبار:{' '}
                  {quiz.endsAt ? formatDate(quiz.endsAt) : 'مفتوح'}
                </p>
                <Separator className='my-2' />
                <p>وقت بدأ الإختبار: {formatDate(quiz.enteredAt!)}</p>
                <p>وقت تسليم الإختبار: {formatDate(quiz.submittedAt!)}</p>
              </div>
              <div>
                <h3 className='text-lg font-semibold'>المستخدم</h3>
                {quiz.examinee ? (
                  <div>
                    <p>اسم الطالب: {quiz.examinee.name}</p>
                    <p>البريد الإلكتروني للطالب: {quiz.examinee.email}</p>
                  </div>
                ) : (
                  <p className='text-slate-500'>هذا الإختبار من زائر </p>
                )}
              </div>
            </div>
            <div className='mb-3 rounded bg-white p-3 shadow'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <h2 className='mb-4 inline-block text-center text-xl font-bold'>
                    الأسئلة
                  </h2>
                  <Badge
                    className='sticky top-20 float-left mr-auto mt-1 shadow'
                    // variant={exam?.grade !== null ? 'primary' : 'warning'}
                  >
                    {!quiz.correctedAt && 'لم يتم التصحيح - '}
                    {quiz.grade} من {quiz.total} (
                    {percentage(quiz.grade as number, quiz.total as number)}%)
                  </Badge>
                  <div>
                    {quiz.questions.map(
                      ({ id, question, grade, order, answer, weight }) => (
                        <div
                          key={id}
                          className={clsx('mb-2 rounded p-3', {
                            'bg-green-200': grade === weight,
                            'bg-orange-200': 0 < grade && grade < weight,
                            'bg-red-200':
                              grade === 0 &&
                              (quiz?.grade !== null ||
                                question.type === QuestionType.MCQ),
                            'bg-gray-300':
                              grade === 0 &&
                              quiz?.grade === null &&
                              question.type === QuestionType.WRITTEN,
                          })}
                        >
                          <div className='flex items-center'>
                            {order}.
                            <Badge className='ml-2 mr-1'>
                              {enStyleToAr(question.style)}
                            </Badge>
                            <p>{question.text}</p>
                          </div>
                          <p
                            className={clsx(
                              answer === question.answer && 'text-green-600',
                              question.type === QuestionType.MCQ &&
                                answer !== question.answer &&
                                'text-red-500'
                            )}
                          >
                            إجابة الطالب: {answer || '(لا يوجد إجابة)'}
                          </p>
                          <p>الإجابة الصحيحة: {question.answer}</p>
                          {question.type === QuestionType.WRITTEN && (
                            <p>
                              نسبة التطابق مع الإجابة الصحيحة:{' '}
                              {(
                                compareTwoStrings(
                                  normalizeText(question.answer),
                                  normalizeText('' + answer)
                                ) * 100
                              ).toFixed(2)}
                              %
                            </p>
                          )}
                          <FormField
                            control={form.control}
                            name={`questions.${id}`}
                            render={({ field }) =>
                              question.type === 'MCQ' ? (
                                <MCQQuestionCorrector
                                  field={field}
                                  weight={weight}
                                />
                              ) : (
                                <WrittenQuestionCorrector
                                  field={field}
                                  grade={grade}
                                  weight={weight}
                                />
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                  <Button
                    variant='success'
                    className='mt-2'
                    type='submit'
                    loading={examCorrect.isLoading}
                  >
                    حفظ
                  </Button>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <p>هذا الإختبار لم يتم تسليمه</p>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // TODO: auth check
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  const prisma = enhance(_prisma, { user: session?.user })

  if (
    session?.user.role !== UserRole.ADMIN &&
    session?.user.role !== UserRole.CORRECTOR
  )
    return { notFound: true }

  const quiz = await prisma.quiz.findFirst({
    where: { id: ctx.params!.id as string },
    include: {
      questions: { include: { question: true }, orderBy: { order: 'asc' } },
      examinee: true,
    },
  })

  if (!quiz)
    return {
      notFound: true,
    }

  return {
    props: { quiz },
  }
}

CorrectQuizPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default CorrectQuizPage
