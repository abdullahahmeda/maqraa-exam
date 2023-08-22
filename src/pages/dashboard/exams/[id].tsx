import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { compareTwoStrings } from 'string-similarity'
import { Button } from '~/components/ui/button'
import DashboardLayout from '~/components/dashboard/layout'
import { QuestionType } from '~/constants'
import { api } from '~/utils/api'
import { percentage } from '~/utils/percentage'
import { enStyleToAr, enTypeToAr } from '~/utils/questions'
import { isCorrectAnswer, normalizeText } from '~/utils/strings'
import { Badge } from '~/components/ui/badge'
import { User, UserRole } from '@prisma/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { prisma as _prisma } from '~/server/db'
import { withPresets } from '@zenstackhq/runtime'
import { getServerAuthSession } from '~/server/auth'
import { Checkbox } from '~/components/ui/checkbox'
import { formatDate } from '~/utils/formatDate'
import { CheckedState } from '@radix-ui/react-checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { correctExamSchema } from '~/validation/correctExamSchema'
import { z } from 'zod'
import { useToast } from '~/components/ui/use-toast'

type FieldValues = {
  id: string
  groups: Record<
    string,
    {
      questions: Record<string, CheckedState>
    }
  >
  user: User | null
}

const ExamPage = ({
  exam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(correctExamSchema),
  })
  const router = useRouter()

  const examCorrect = api.exams.correct.useMutation()
  // const gradeEmailSend = api.emails.sendGradeEmail.useMutation()

  useEffect(() => {
    if (exam) {
      form.reset({
        id: exam.id,
        groups: exam.groups.reduce(
          (groupAcc, group) => ({
            ...groupAcc,
            [group.id]: {
              questions: group.questions.reduce(
                (questionAcc, question) => ({
                  ...questionAcc,
                  [question.id]: question.isCorrect,
                }),
                {}
              ),
            },
          }),
          {}
        ),
      })
    }
  }, [exam, form])

  // const isLoading = _isLoading || isPaused

  const onSubmit = (data: FieldValues) => {
    examCorrect
      .mutateAsync({
        id: exam.id,
        groups: form.getValues('groups') as any,
      })
      .then((isEmailSent) => {
        if (isEmailSent) {
          // toast({ title: 'تم حفظ الاختبار وارسال الدرجة بنجاح' })
        }
        // TODO: fix this toast
        else 'nothing'
        toast({ title: 'تم حفظ الاختبار' })
        router.push('/dashboard/exams')
        // toast(
        //   (t) => (
        //     <div className='flex flex-col items-center justify-between gap-3'>
        //       <p>
        //         تم حفظ الدرجة لكن حدث خطأ أثناء ارسال الايميل، هل تريد إعادة
        //         المحاولة؟
        //       </p>
        //       <div className='flex gap-2'>
        //         <Button
        //           variant='success'
        //           onClick={() => {
        //             toast.dismiss(t.id)
        //             const newToast = toast.loading('جاري ارسال الإيميل')
        //             gradeEmailSend
        //               .mutateAsync({
        //                 id: exam!.id,
        //               })
        //               .then(() => {
        //                 toast.dismiss(newToast)
        //                 toast.success('تم ارسال الإيميل بنجاح!')
        //               })
        //               .catch(() => {
        //                 toast.dismiss(newToast)
        //                 toast.error(
        //                   'فشل ارسال الإيميل، ربما تم تخطي الحد المسموح به من الرسائل. الرجاء المحاولة لاحقاً'
        //                 )
        //               })
        //               .finally(() => router.push('/dashboard/exams'))
        //           }}
        //         >
        //           نعم
        //         </Button>
        //         <Button
        //           onClick={() => {
        //             toast.dismiss(t.id)
        //             router.push('/dashboard/exams')
        //           }}
        //         >
        //           لا
        //         </Button>
        //       </div>
        //     </div>
        //   ),
        //   {
        //     duration: Infinity,
        //   }
        // )
      })
      .catch((error) => {
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  const allQuestions = exam.groups.flatMap((g) => g.questions)

  const correctAnswers = exam.groups.flatMap((g) =>
    g.questions.filter(({ isCorrect }) => isCorrect)
  )

  let possibleGrade: null | number = null
  if (exam.grade === null)
    possibleGrade = exam.groups.reduce(
      (groupAcc, group) =>
        groupAcc +
        group.questions.reduce((acc, { answer, question }) => {
          return acc + Number(isCorrectAnswer(question, answer))
        }, 0),
      0
    )

  return (
    <>
      <Head>
        <title>تصحيح اختبار</title>
      </Head>

      <div className='space-y-4'>
        <div className='space-y-2 rounded-md bg-white p-4 shadow'>
          <h2 className='text-xl font-bold'>معلومات عن الإختبار</h2>
          <div>
            <p>وقت فتح الإختبار: {formatDate(exam.createdAt)}</p>
            {/* <p>وقت غلق الإختبار: kofta</p> */}
            <p>وقت بدأ الإختبار: {formatDate(exam.enteredAt!)}</p>
            <p>وقت تسليم الإختبار: {formatDate(exam.submittedAt!)}</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold'>المستخدم</h3>
            {exam.user ? (
              <div>
                <p>اسم الطالب: {exam.user.name}</p>
                <p>البريد الإلكتروني للطالب: {exam.user.email}</p>
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
                {exam?.grade === null
                  ? `لم يتم التصحيح - ${possibleGrade} من ${
                      allQuestions?.length
                    } (${percentage(possibleGrade!, allQuestions?.length)}%)`
                  : `${correctAnswers?.length} من ${
                      allQuestions?.length
                    } (${percentage(
                      correctAnswers!.length,
                      allQuestions?.length
                    )}%)`}
              </Badge>
              <div>
                {exam.groups.map((group, i) =>
                  group.questions.map(
                    ({ id, question, isCorrect, order, answer }) => (
                      <div
                        key={id}
                        className={clsx('mb-2 rounded p-3', {
                          'bg-green-200': isCorrect,
                          'bg-red-200':
                            !isCorrect &&
                            (exam?.grade !== null ||
                              question.type === QuestionType.MCQ),
                          'bg-gray-300':
                            !isCorrect &&
                            exam?.grade === null &&
                            question.type === QuestionType.WRITTEN,
                        })}
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
                          name={`groups.${group.id}.questions.${id}`}
                          render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 space-x-reverse'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className='space-y-1 leading-none'>
                                <FormLabel>تعيين كإجابة صحيحة</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )
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
      </div>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // TODO: auth check
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  const prisma = withPresets(_prisma, { user: session?.user })

  if (
    session?.user.role !== UserRole.ADMIN &&
    session?.user.role !== UserRole.CORRECTOR
  )
    return { notFound: true }

  const exam = await prisma.exam.findFirst({
    where: { id: ctx.params!.id as string },
    include: {
      groups: {
        include: {
          questions: { include: { question: true }, orderBy: { order: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
      user: true,
    },
  })

  if (!exam)
    return {
      notFound: true,
    }

  return {
    props: {
      exam,
    },
  }
}

ExamPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default ExamPage
