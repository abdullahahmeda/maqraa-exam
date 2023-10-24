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
import { checkRead } from '~/server/api/routers/custom/helper'
import { enhance } from '@zenstackhq/runtime'
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
import { QuizService } from '~/services/quiz'
import { Alert, AlertTitle } from '~/components/ui/alert'

type FieldValues = {
  id: string
  questions: Record<string, string>
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

  const examSubmit = api.submitExam.useMutation()

  useEffect(() => {
    form.reset({
      id: exam.id,
      questions: (exam.questions as any[]).reduce(
        (questionAcc, question) => ({
          ...questionAcc,
          [question.id]: question.answer || undefined,
        }),
        {}
      ),
    })
  }, [form, exam.id, exam.questions])

  const onSubmit = (data: FieldValues) => {
    for (let question of Object.values(data.questions)) {
      if ([undefined, ''].includes(question))
        return setConfirmationDialogOpen(true)
    }
    submitForm()
  }

  const submitForm = () => {
    examSubmit
      .mutateAsync({
        id: exam!.id,
        // id: 'clet8uawe000g356lbmte45my',
        questions: form.getValues('questions'),
      })
      .then(() => {
        router.reload()
      })
      .catch((error) => {
        if (error.message) toast({ title: error.message })
        else toast({ title: 'حدث خطأ غير متوقع' })
      })
  }

  const totalGrade = (exam.questions as any[]).reduce(
    (acc, question) => acc + question.weight,
    0
  )

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
                  ({ question, id, order, grade, weight }) => (
                    <div
                      key={id}
                      className={cn(
                        'mb-4 rounded p-2',
                        exam.grade !== null &&
                          grade === weight &&
                          'bg-success/20',
                        exam.grade !== null &&
                          0 < grade &&
                          grade < weight &&
                          'bg-orange-500/20',
                        exam.grade !== null &&
                          grade === 0 &&
                          'bg-destructive/20'
                      )}
                    >
                      <div className='flex items-center'>
                        {order}.
                        <Badge className='ml-2 mr-1'>
                          {enStyleToAr(question.style)}
                        </Badge>
                        <p>{question.text}</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='mr-2'
                                onClick={() => setSelectedQuestion(question.id)}
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
                          name={`questions.${id}`}
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
                                        <FormLabel>
                                          {question.option1}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                    {question.option2 && (
                                      <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value={question.option2}
                                          />
                                        </FormControl>
                                        <FormLabel>
                                          {question.option2}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                    {question.option3 && (
                                      <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value={question.option3}
                                          />
                                        </FormControl>
                                        <FormLabel>
                                          {question.option3}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                    {question.option4 && (
                                      <FormItem className='flex items-center space-x-3 space-y-0 space-x-reverse'>
                                        <FormControl>
                                          <RadioGroupItem
                                            value={question.option4}
                                          />
                                        </FormControl>
                                        <FormLabel>
                                          {question.option4}
                                        </FormLabel>
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
                  )
                )}
                {!exam.submittedAt && session?.user.id == exam.examineeId && (
                  <Button loading={examSubmit.isLoading}>تسليم</Button>
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
  const prisma = enhance(_prisma, { user: session?.user })
  const quizService = new QuizService(prisma)

  const quiz = await checkRead(
    prisma.quiz.findFirst({
      where: { id },
      include: {
        questions: {
          select: {
            question: true,
            order: true,
            id: true,
            answer: true,
            grade: true,
            weight: true,
          },
          orderBy: { order: 'asc' },
        },
        groups: true,
        curriculum: { include: { parts: true, track: true } },
      },
    })
  )

  if (!quiz) return { notFound: true }

  if (quiz.submittedAt)
    return {
      props: {
        exam: {
          ...quiz,
          curriculum: undefined,
        },
      },
    }

  // If exam time has ended, return not found
  if (quiz.endsAt && quiz.endsAt <= new Date())
    return { redirect: { destination: '/quizzes/expired', permanent: false } }

  // not submitted but questions have been made, so hide answers
  if (quiz.enteredAt)
    return {
      props: {
        exam: {
          ...quiz,
          questions: quiz.questions.map((q) => ({
            ...q,
            question: {
              ...q.question,
              answer: undefined,
              anotherAnswer: undefined,
              isInsideShaded: undefined,
            },
          })),
          curriculum: undefined,
        },
      },
    }

  // exam is entered for the first time, create questions
  const questions = await quizService.getQuestionsForGroups({
    groups: quiz.groups,
    curriculumId: quiz.curriculumId,
    repeatFromSameHadith: quiz.repeatFromSameHadith,
  })

  await _prisma.quiz.update({
    where: { id },
    data: {
      enteredAt: new Date(),
      questions: {
        create: questions.map((q) => ({
          questionId: q.id,
          weight: q.weight,
          order: q.order,
        })),
      },
    },
  })

  return {
    props: {
      exam: (await prisma.quiz.findFirst({
        where: { id },
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
              grade: true,
              weight: true,
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
