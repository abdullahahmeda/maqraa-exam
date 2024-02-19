import Head from 'next/head'
import { api } from '~/utils/api'
import { useForm } from 'react-hook-form'
import { Badge } from '~/components/ui/badge'
import { useRouter } from 'next/router'
import { Button } from '~/components/ui/button'
import { useState, useEffect } from 'react'
import WebsiteLayout from '~/components/layout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { db } from '~/server/db'
import { getServerAuthSession } from '~/server/auth'
import { Form } from '~/components/ui/form'
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
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { AlertCircleIcon, AlertTriangleIcon } from 'lucide-react'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { ReportErrorDialog } from '~/components/modals/report-error'
import { Alert, AlertTitle } from '~/components/ui/alert'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { QuestionCard } from '~/components/ui/question-card'
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'

type FieldValues = {
  id: string
  answers: Record<string, string>
}

const ExamPage = ({
  exam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const router = useRouter()
  const form = useForm<FieldValues>()
  const { data: session } = useSession()

  const [errorReportData, setErrorReportData] = useState<{
    quizId: string
    questionId: string
  } | null>(null)

  const quizSubmit = api.quiz.submit.useMutation()

  useEffect(() => {
    form.reset({
      id: exam.id,
      answers: (exam.questions as any[]).reduce(
        (questionAcc, question) => ({
          ...questionAcc,
          [question.id]: question.userAnswer?.answer || undefined,
        }),
        {}
      ),
    })
  }, [form, exam.id, exam.questions])

  const onSubmit = (data: FieldValues) => {
    for (let answer of Object.values(data.answers)) {
      if ([undefined, ''].includes(answer))
        return setConfirmationDialogOpen(true)
    }
    submitForm()
  }

  const submitForm = () => {
    quizSubmit
      .mutateAsync({
        id: exam!.id,
        answers: form.getValues('answers'),
      })
      .then(() => {
        router.reload()
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const totalGrade = exam.total

  const isOfficiallyCorrected =
    (!!exam.systemExamId && exam.correctorId) ||
    (!exam.systemExamId && exam.correctedAt)

  return (
    <>
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
        {!!exam.submittedAt ||
          (session?.user.id != exam.examineeId && (
            <Alert className='mb-4 border-orange-300 bg-orange-300 shadow'>
              <AlertTitle className='flex items-center gap-2'>
                <AlertCircleIcon className='h-4 w-4' />
                هذا لعرض الإختبار فقط ولا يمكنك تسليم الإختبار.
              </AlertTitle>
            </Alert>
          ))}

        <div className='rounded-md bg-gray-50 p-4 shadow'>
          <h3 className='mb-4 text-center text-lg font-semibold'>
            {!!exam.systemExamId ? exam.systemExamName : 'إختبار تجريبي'}
          </h3>
          {exam.grade !== null && (
            <div className='mb-4 flex justify-end'>
              <Badge className='shadow'>
                الدرجة{!isOfficiallyCorrected && ' التقريبية'}: {exam.grade} من{' '}
                {totalGrade}
              </Badge>
            </div>
          )}
          {!isOfficiallyCorrected && exam.submittedAt && (
            <Alert className='mb-2 border-orange-300 bg-orange-300'>
              <AlertTitle className='flex items-center gap-2'>
                <AlertCircleIcon className='h-4 w-4' />
                هذه النتيجة تقريبية وليست النتيجة النهائية. سيتم اعتماد النتيجة
                النهائية بعد التصحيح اليدوي
              </AlertTitle>
            </Alert>
          )}
          <Dialog
            open={errorReportData !== null}
            onOpenChange={(open) =>
              setErrorReportData(open ? errorReportData : null)
            }
          >
            <Form {...form}>
              <form
                onSubmit={
                  !!exam.submittedAt || session?.user.id != exam.examineeId
                    ? () => undefined
                    : form.handleSubmit(onSubmit)
                }
              >
                <div className='space-y-4'>
                  {exam.questions.map(
                    ({ id, order, userAnswer, weight, ...question }) => (
                      <div className='flex gap-2' key={id}>
                        <div className='text-center'>
                          <p>{order}) </p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='mt-2'
                                  onClick={() =>
                                    setErrorReportData({
                                      quizId: exam.id,
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
                        <QuestionCard
                          question={question as any}
                          form={form}
                          style={question.style as any}
                          fields={{
                            answer: `answers.${id}`,
                          }}
                          weight={weight}
                          className='flex-1'
                        />
                      </div>
                    )
                  )}
                </div>
                {!exam.submittedAt && session?.user.id == exam.examineeId && (
                  <Button
                    loading={quizSubmit.isPending}
                    className='mt-4'
                    size='lg'
                  >
                    تسليم
                  </Button>
                )}
              </form>
            </Form>
            <DialogContent>
              <ReportErrorDialog
                data={errorReportData!}
                closeDialog={() => setErrorReportData(null)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}

ExamPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = ctx.params!.id as string

  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  const quiz = await db
    .selectFrom('Quiz')
    .selectAll('Quiz')
    .leftJoin('SystemExam', 'Quiz.systemExamId', 'SystemExam.id')
    .select((eb) => [
      'SystemExam.name as systemExamName',
      jsonArrayFrom(
        eb
          .selectFrom('ModelQuestion')
          .leftJoin('Question', 'ModelQuestion.questionId', 'Question.id')
          .select(({ eb, selectFrom, ref }) => [
            'Question.id as questionId',
            'ModelQuestion.id',
            'ModelQuestion.order',
            'ModelQuestion.weight',
            'Question.text',
            'Question.option1',
            'Question.option2',
            'Question.option3',
            'Question.option4',
            'Question.textForFalse',
            'Question.textForTrue',
            'Question.type',
            eb
              .case()
              .when('Quiz.submittedAt', 'is not', null)
              .then(ref('Question.answer'))
              .end()
              .as('correctAnswer'),
            jsonObjectFrom(
              selectFrom('QuestionStyle')
                .selectAll('QuestionStyle')
                .whereRef('Question.styleId', '=', 'QuestionStyle.id')
            ).as('style'),
            jsonObjectFrom(
              selectFrom('Answer')
                .select(['Answer.answer', 'Answer.grade'])
                .whereRef('Answer.modelQuestionId', '=', 'ModelQuestion.id')
                .where('Answer.quizId', '=', id)
            ).as('userAnswer'),
            jsonObjectFrom(
              selectFrom('ErrorReport')
                .selectAll('ErrorReport')
                .whereRef(
                  'ErrorReport.modelQuestionId',
                  '=',
                  'ModelQuestion.id'
                )
                .where('ErrorReport.quizId', '=', id)
            ).as('errorReport'),
          ])
          .whereRef('Quiz.modelId', '=', 'ModelQuestion.modelId')
          .orderBy('ModelQuestion.order', 'asc')
      ).as('questions'),
    ])
    .where('Quiz.id', '=', id)
    .executeTakeFirst()

  if (!quiz) return { notFound: true }

  if (
    quiz.examineeId &&
    session?.user.id !== quiz.examineeId &&
    session?.user.role !== 'ADMIN'
  )
    return { notFound: true }

  if (quiz.submittedAt)
    return {
      props: {
        exam: quiz,
      },
    }

  // If exam time has ended, return not found
  if (
    session?.user.role !== 'ADMIN' &&
    quiz.endsAt &&
    quiz.endsAt <= new Date()
  )
    return { redirect: { destination: '/quizzes/expired', permanent: false } }

  // hide answers

  if (quiz.examineeId === session?.user.id)
    await db
      .updateTable('Quiz')
      .set({ enteredAt: new Date() })
      .where('id', '=', id)
      .execute()

  return {
    props: {
      exam: quiz,
    },
  }
}

export default ExamPage
