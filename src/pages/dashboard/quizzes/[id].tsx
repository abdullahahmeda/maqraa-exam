import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { compareTwoStrings } from 'string-similarity'
import { Button } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import { api } from '~/utils/api'
import { percentage } from '~/utils/percentage'
import { correctQuestion, normalizeText } from '~/utils/strings'
import { Badge } from '~/components/ui/badge'
import { QuestionType, UserRole } from '~/kysely/enums'
import { User } from '~/kysely/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { db } from '~/server/db'
import { getServerAuthSession } from '~/server/auth'
import { formatDate } from '~/utils/formatDate'
import { zodResolver } from '@hookform/resolvers/zod'
import { correctQuizSchema } from '~/validation/correctQuizSchema'
import { useToast } from '~/components/ui/use-toast'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

type FieldValues = {
  id: string
  answers: Record<string, number>
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

  const examCorrect = api.quiz.correct.useMutation()
  // const gradeEmailSend = api.emails.sendGradeEmail.useMutation()

  useEffect(() => {
    if (quiz) {
      form.reset({
        id: quiz.id,
        answers: quiz.answers.reduce(
          (questionAcc, question) => ({
            ...questionAcc,
            [question.id as string]: question.grade,
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
        answers: form.getValues('answers') as any,
      })
      .then(() => {
        const isEmailSent = false
        if (isEmailSent) {
          // toast({ title: 'تم حفظ الاختبار وارسال الدرجة بنجاح' })
        } else 'nothing'
        toast({ title: 'تم حفظ الاختبار' })
        // router.push('/dashboard/exams')
      })
      .catch((error: any) => {
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  const isOfficiallyCorrected = !!quiz.correctorId

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
                {quiz.examineeName ? (
                  <div>
                    <p>اسم الطالب: {quiz.examineeName}</p>
                    <p>البريد الإلكتروني للطالب: {quiz.examineeEmail}</p>
                  </div>
                ) : (
                  <p className='text-slate-500'>هذا الإختبار من زائر </p>
                )}
              </div>
            </div>
            <div className='mb-3 rounded-md bg-white p-4 shadow'>
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
                    {quiz.answers.map(
                      ({
                        id,
                        grade,
                        order,
                        correctAnswer,
                        weight,
                        ...question
                      }) => (
                        <div
                          key={id}
                          className={clsx('mb-3 rounded-md px-4 py-3', {
                            'bg-green-200':
                              grade === weight &&
                              (question.type === 'MCQ' ||
                                isOfficiallyCorrected),
                            'bg-red-200':
                              grade === 0 &&
                              (question.type === 'MCQ' ||
                                isOfficiallyCorrected),
                            'bg-slate-200':
                              !isOfficiallyCorrected &&
                              question.type === 'WRITTEN',
                            // 'bg-orange-200':
                            //   grade !== null && 0 < grade && grade < weight!,
                            // 'bg-red-200':
                            //   grade === 0 &&
                            //   (quiz?.grade !== null ||
                            //     question.type === QuestionType.MCQ),
                            // 'bg-gray-300':
                            //   grade === 0 &&
                            //   quiz?.grade === null &&
                            //   question.type === QuestionType.WRITTEN,
                          })}
                        >
                          <div className='flex items-center'>
                            {order}.
                            <Badge className='ml-2 mr-1'>
                              {question.style}
                            </Badge>
                            <p>{question.text}</p>
                          </div>
                          <p
                            className={clsx(
                              correctAnswer === question.examineeAnswer &&
                                'text-green-600',
                              question.type === QuestionType.MCQ &&
                                correctAnswer !== question.examineeAnswer &&
                                'text-red-500'
                            )}
                          >
                            إجابة الطالب:{' '}
                            {question.examineeAnswer || '(لا يوجد إجابة)'}
                          </p>
                          <p>الإجابة الصحيحة: {correctAnswer}</p>
                          {question.type === QuestionType.WRITTEN && (
                            <p>
                              نسبة التطابق مع الإجابة الصحيحة:{' '}
                              {(
                                compareTwoStrings(
                                  normalizeText(question.examineeAnswer ?? ''),
                                  normalizeText('' + correctAnswer)
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
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (
    session?.user.role !== UserRole.ADMIN &&
    session?.user.role !== UserRole.CORRECTOR
  )
    return { notFound: true }

  const quiz = await db
    .selectFrom('Quiz')
    .leftJoin('User', 'Quiz.examineeId', 'User.id')
    .selectAll('Quiz')
    .select((eb) => [
      'User.name as examineeName',
      'User.email as examineeEmail',
      jsonArrayFrom(
        eb
          .selectFrom('Answer')
          .leftJoin(
            'ModelQuestion',
            'Answer.modelQuestionId',
            'ModelQuestion.id'
          )
          .leftJoin('Question', 'ModelQuestion.questionId', 'Question.id')
          .leftJoin('QuestionStyle', 'Question.styleId', 'QuestionStyle.id')
          .whereRef('Answer.quizId', '=', 'Quiz.id')
          .whereRef('ModelQuestion.modelId', '=', 'Quiz.modelId')
          .select([
            'Answer.id',
            'Answer.answer as examineeAnswer',
            'Answer.grade',
            'ModelQuestion.order',
            'ModelQuestion.weight',
            'Question.text',
            'Question.option1',
            'Question.option2',
            'Question.option3',
            'Question.option4',
            'Question.textForFalse',
            'Question.textForTrue',
            'QuestionStyle.name as style',
            'Question.type',
            'Question.answer as correctAnswer',
          ])
          .orderBy('ModelQuestion.order asc')
      ).as('answers'),
    ])
    .where('Quiz.id', '=', ctx.params!.id as string)
    .executeTakeFirst()

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
