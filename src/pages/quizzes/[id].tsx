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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { AlertTriangleIcon } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '~/components/ui/dialog'
import { ReportErrorDialog } from '~/components/modals/report-error'
import { Alert, AlertTitle } from '~/components/ui/alert'
import { QuestionType } from '~/kysely/enums'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { formatNumber } from '~/utils/strings'

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
  const { toast } = useToast()
  const { data: session } = useSession()

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

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
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  const totalGrade = exam.total

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
            <Alert className='border-orange-300 bg-orange-300'>
              <AlertTitle>
                هذا لعرض الإختبار فقط ولا يمكنك تسليم الإختبار.
              </AlertTitle>
            </Alert>
          ))}

        <div className='rounded-md bg-white p-4 shadow'>
          <h3 className='mb-4 text-center text-lg font-semibold'>
            {!!exam.systemExamId ? exam.systemExamName : 'إختبار تجريبي'}
          </h3>
          {exam.grade !== null && (
            <div className='sticky top-3 z-10 float-left'>
              <Badge className='shadow'>
                الدرجة: {exam.grade} من {totalGrade}
              </Badge>
            </div>
          )}
          <Dialog
            open={selectedQuestion !== null}
            onOpenChange={(open) =>
              setSelectedQuestion(open ? selectedQuestion : null)
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
                {exam.questions.map(
                  ({ id, order, userAnswer, weight, ...question }) => (
                    <div
                      key={id}
                      className={cn(
                        'mb-4 rounded-md py-2',
                        exam.submittedAt && 'px-4',
                        exam.grade !== null &&
                          userAnswer?.grade === weight &&
                          'bg-success/20',
                        exam.grade !== null &&
                          typeof userAnswer?.grade === 'number' &&
                          0 < userAnswer?.grade &&
                          userAnswer?.grade < weight &&
                          'bg-orange-500/20',
                        exam.grade !== null &&
                          userAnswer?.grade === 0 &&
                          'bg-destructive/20'
                      )}
                    >
                      <div className='flex items-center'>
                        {order}.
                        <Badge className='ml-2 mr-1'>{question.style}</Badge>
                        <p>
                          {question.text} (
                          {formatNumber(weight, {
                            zero: '',
                            few: 'درجات',
                            many: 'درجة',
                            other: 'درجة',
                            one: 'درجة واحدة',
                            two: 'درجتان',
                          })}
                          )
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='mr-2'
                                onClick={() =>
                                  setSelectedQuestion(question.questionId)
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
                      <div className='mt-2'>
                        <FormField
                          control={form.control}
                          name={`answers.${id}`}
                          render={({ field }) => (
                            <FormItem
                              className={cn(
                                question.type === QuestionType.MCQ &&
                                  'space-y-2'
                              )}
                            >
                              <FormLabel>
                                {exam.submittedAt
                                  ? 'الإجابة الخاصة بك'
                                  : 'الإجابة'}
                              </FormLabel>
                              {question.type === 'WRITTEN' ? (
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    disabled={!!exam.submittedAt}
                                    className='bg-white'
                                  />
                                </FormControl>
                              ) : (
                                <FormControl>
                                  <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!!exam.submittedAt}
                                  >
                                    {question.choicesColumns?.map((column) => (
                                      <FormItem
                                        key={column}
                                        className='flex items-center space-x-3 space-y-0 space-x-reverse'
                                      >
                                        <FormControl>
                                          <RadioGroupItem
                                            value={
                                              question[
                                                column as keyof typeof question
                                              ] as string
                                            }
                                          />
                                        </FormControl>
                                        <FormLabel>
                                          {
                                            question[
                                              column as keyof typeof question
                                            ]
                                          }
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {!!exam.correctedAt && (
                        <p className='mt-2'>
                          الإجابة الصحيحة: {(question as any).correctAnswer}
                        </p>
                      )}
                    </div>
                  )
                )}
                {!exam.submittedAt && session?.user.id == exam.examineeId && (
                  <Button loading={quizSubmit.isLoading}>تسليم</Button>
                )}
              </form>
            </Form>
            <DialogContent>
              <ReportErrorDialog
                questionId={selectedQuestion as string}
                closeDialog={() => setSelectedQuestion(null)}
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
          .leftJoin('QuestionStyle', 'Question.styleId', 'QuestionStyle.id')
          .select(({ eb, selectFrom }) => [
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
            'QuestionStyle.name as style',
            'QuestionStyle.choicesColumns',
            'Question.type',
            'Question.answer as correctAnswer',
            jsonObjectFrom(
              selectFrom('Answer')
                .select(['Answer.answer', 'Answer.grade'])
                .whereRef('Answer.modelQuestionId', '=', 'ModelQuestion.id')
                .where('Answer.quizId', '=', id)
            ).as('userAnswer'),
          ])
          .whereRef('Quiz.modelId', '=', 'ModelQuestion.modelId')
          .orderBy('ModelQuestion.order asc')
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
