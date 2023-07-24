import Head from 'next/head'
import { api } from '~/utils/api'
import { useForm } from 'react-hook-form'
import { Badge } from '~/components/ui/badge'
import { enStyleToAr } from '~/utils/questions'
import { QuestionStyle, QuestionType } from '~/constants'
import { useRouter } from 'next/router'
import { Button } from '~/components/ui/button'
import { useState, useEffect } from 'react'
import WebsiteLayout from '~/components/layout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { checkRead } from '~/server/api/routers/helper'
import { withPresets } from '@zenstackhq/runtime'
import { prisma as _prisma } from '~/server/db'
import { getServerAuthSession } from '~/server/auth'
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
import { cn } from '~/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { useToast } from '~/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import sampleSize from 'lodash.samplesize'

type FieldValues = {
  id: string
  groups: Record<
    string,
    {
      questions: Record<string, string>
    }
  >
}

const ExamPage = ({
  exam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const router = useRouter()
  const form = useForm<FieldValues>()
  const { toast } = useToast()

  const examSubmit = api.exams.submit.useMutation()

  useEffect(() => {
    form.reset({
      id: exam.id,
      groups: (exam.groups as any[]).reduce(
        (groupAcc, group) => ({
          ...groupAcc,
          [group.id]: {
            questions: (group.questions as any[]).reduce(
              (questionAcc, question) => ({
                ...questionAcc,
                [question.id]: question.answer || undefined,
              }),
              {}
            ),
          },
        }),
        {}
      ),
    })
  }, [form, exam.id, exam.groups])

  const onSubmit = (data: FieldValues) => {
    for (let group of Object.values(data.groups)) {
      for (let question of Object.values(group.questions)) {
        if ([undefined, ''].includes(question))
          return setConfirmationDialogOpen(true)
      }
    }
    submitForm()
  }

  const submitForm = () => {
    examSubmit
      .mutateAsync({
        id: exam!.id,
        // id: 'clet8uawe000g356lbmte45my',
        groups: form.getValues('groups'),
      })
      .then(() => {
        router.reload()
      })
      .catch((error) => {
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  const totalQuestions = (exam.groups as any[]).reduce(
    (acc, group) => acc + group.questions.length,
    0
  )

  console.log(exam)

  return (
    <>
      <style global jsx>{`
        body {
          background: linear-gradient(
              to bottom,
              rgba(92, 77, 66, 0.9) 0%,
              rgba(92, 77, 66, 0.9) 100%
            ),
            url(/bg.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-size: cover;
          min-height: 100vh;
          background-attachment: fixed;
        }
      `}</style>
      <Head>
        <title>اختبار</title>
      </Head>
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
        <div className='rounded-md bg-white p-2 shadow'>
          {exam.grade !== null && (
            <div className='sticky top-3 z-10 float-left'>
              <Badge className='shadow'>
                الدرجة: {exam.grade} من {totalQuestions}
              </Badge>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={
                exam.submittedAt ? () => undefined : form.handleSubmit(onSubmit)
              }
            >
              {exam.groups.map((group, i) =>
                group.questions.map(({ question, id, order, isCorrect }) => (
                  <div
                    key={id}
                    className={cn(
                      'mb-4 rounded p-2',
                      exam.grade !== null &&
                        isCorrect === true &&
                        'bg-success/20',
                      exam.grade !== null &&
                        isCorrect === false &&
                        'bg-destructive/20'
                    )}
                  >
                    <div className='flex items-center'>
                      {exam.groups
                        .slice(0, i)
                        .reduce(
                          (acc, g) => acc + g.order * g.questions.length,
                          0
                        ) + order}
                      .
                      <Badge className='ml-2 mr-1'>
                        {enStyleToAr(question.style)}
                      </Badge>
                      <p>{question.text}</p>
                    </div>
                    <div className='mt-2'>
                      <FormField
                        control={form.control}
                        name={`groups.${group.id}.questions.${id}`}
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              question.type === QuestionType.MCQ && 'space-y-2'
                            )}
                          >
                            <FormLabel>
                              {exam.submittedAt
                                ? 'الإجابة الخاصة بك'
                                : 'الإجابة'}
                            </FormLabel>
                            {question.type === QuestionType.WRITTEN ? (
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!!exam.submittedAt}
                                  className='bg-white'
                                />
                              </FormControl>
                            ) : question.style === QuestionStyle.CHOOSE ? (
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!!exam.submittedAt}
                                >
                                  {question.option1 && (
                                    <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                      <FormControl>
                                        <RadioGroupItem
                                          value={question.option1}
                                        />
                                      </FormControl>
                                      <FormLabel>{question.option1}</FormLabel>
                                    </FormItem>
                                  )}
                                  {question.option2 && (
                                    <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                      <FormControl>
                                        <RadioGroupItem
                                          value={question.option2}
                                        />
                                      </FormControl>
                                      <FormLabel>{question.option2}</FormLabel>
                                    </FormItem>
                                  )}
                                  {question.option3 && (
                                    <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                      <FormControl>
                                        <RadioGroupItem
                                          value={question.option3}
                                        />
                                      </FormControl>
                                      <FormLabel>{question.option3}</FormLabel>
                                    </FormItem>
                                  )}
                                  {question.option4 && (
                                    <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                      <FormControl>
                                        <RadioGroupItem
                                          value={question.option4}
                                        />
                                      </FormControl>
                                      <FormLabel>{question.option4}</FormLabel>
                                    </FormItem>
                                  )}
                                </RadioGroup>
                              </FormControl>
                            ) : (
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!!exam.submittedAt}
                                >
                                  <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                    <FormControl>
                                      <RadioGroupItem
                                        value={question.textForTrue!}
                                      />
                                    </FormControl>
                                    <FormLabel>
                                      {question.textForTrue}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                    <FormControl>
                                      <RadioGroupItem
                                        value={question.textForFalse!}
                                      />
                                    </FormControl>
                                    <FormLabel>
                                      {question.textForFalse}
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {(question as any)?.answer && (
                      <p className='mt-2'>
                        الإجابة الصحيحة: {(question as any).answer}
                      </p>
                    )}
                  </div>
                ))
              )}
              {!exam.submittedAt && (
                <Button loading={examSubmit.isLoading}>تسليم</Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
ExamPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = ctx.params!.id as string

  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  const prisma = await withPresets(_prisma, { user: session?.user })

  const exam = await checkRead(
    prisma.exam.findFirst({
      where: { id },
      include: {
        groups: {
          include: {
            questions: {
              select: {
                question: true,
                order: true,
                id: true,
                answer: true,
                isCorrect: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        curriculum: { include: { parts: true } },
      },
    })
  )

  if (!exam || exam.studentId !== (session?.user.id || null))
    return { notFound: true }

  if (exam.submittedAt)
    return {
      props: {
        exam: {
          ...exam,
          curriculum: undefined,
        },
      },
    }

  // not submitted but questions have been made, so hide answers
  if (exam.enteredAt)
    return {
      props: {
        exam: {
          ...exam,
          groups: exam.groups.map((g) => ({
            ...g,
            questions: g.questions.map((q) => ({
              ...q,
              question: {
                ...q.question,
                answer: undefined,
                anotherAnswer: undefined,
                isInsideShaded: undefined,
              },
            })),
          })),
          curriculum: undefined,
        },
      },
    }

  // exam is entered for the first time, create questions
  const parts = exam.curriculum.parts.map((part) => ({
    partNumber: part.number,
    hadithNumber: {
      gte: part.from,
      lte: part.to,
    },
  }))

  let usedQuestions: string[] = []
  let usedHathidths: number[] = []

  await Promise.all(
    exam.groups.map(async (g) => {
      let styleQuery =
        g.styleOrType === QuestionType.MCQ ||
        g.styleOrType === QuestionType.WRITTEN
          ? { type: (g.styleOrType as QuestionType) || undefined }
          : { style: (g.styleOrType as QuestionStyle) || undefined }

      const questions = []
      const allPossibleQuestions = await _prisma.question.findMany({
        where: {
          AND: [
            { courseId: exam.courseId },
            { id: { notIn: usedQuestions } },
            { OR: parts },
            { difficulty: g.difficulty || undefined },
            styleQuery,
            { hadithNumber: { notIn: usedHathidths } },
          ],
        },
        // take: g.number,
        select: { id: true, hadithNumber: true },
      })

      const _questions = sampleSize(allPossibleQuestions, g.number)

      for (let [i, q] of _questions.entries()) {
        usedQuestions.push(q.id)
        if (!exam.repeatFromSameHadith) usedHathidths.push(q.hadithNumber)
        questions.push({
          question: { connect: { id: q.id } },
          order: i + 1,
        })
      }

      return _prisma.examQuestionGroup.update({
        where: { id: g.id },
        data: {
          questions: { create: questions },
        },
      })
    })
  )

  await _prisma.exam.update({ where: { id }, data: { enteredAt: new Date() } })

  return {
    props: {
      exam: (await prisma.exam.findFirst({
        where: { id },
        include: {
          groups: {
            include: {
              questions: {
                select: {
                  question: {
                    select: {
                      type: true,
                      difficulty: true,
                      id: true,
                      number: true,
                      option1: true,
                      option2: true,
                      option3: true,
                      option4: true,
                      text: true,
                      textForFalse: true,
                      textForTrue: true,
                      style: true,
                    },
                  },
                  order: true,
                  id: true,
                  answer: true,
                  isCorrect: true,
                },
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
          curriculum: { include: { parts: true } },
        },
      }))!,
    },
  }
}

export default ExamPage
