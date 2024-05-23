import { Badge } from '~/components/ui/badge'
import { db } from '~/server/db'
import { getServerAuthSession } from '~/server/auth'
import { AlertCircleIcon, CheckIcon, XIcon } from 'lucide-react'
import { Alert, AlertTitle } from '~/components/ui/alert'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { notFound } from 'next/navigation'
import { QuizForm } from './_components/form'
import { QuestionCard, QuestionCardText } from '~/components/ui/question-card'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Separator } from '~/components/ui/separator'
import shuffle from 'lodash.shuffle'
import { api } from '~/trpc/server'
import { type Selectable } from 'kysely'
import { QuestionStyle } from '~/kysely/types'
import { QuestionType } from '~/kysely/enums'

export type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }) {
  const quiz = await db
    .selectFrom('Quiz')
    .leftJoin('SystemExam', 'Quiz.systemExamId', 'SystemExam.id')
    .select('SystemExam.name as name')
    .where('Quiz.id', '=', params.id)
    .executeTakeFirst()

  const siteName = await api.setting.getSiteName()

  return {
    title: `${quiz?.name ?? 'إختبار'} | ${siteName}`,
  }
}

const QuizPage = async ({ params }: { params: Params }) => {
  const session = await getServerAuthSession()

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
                .whereRef('Question.styleId', '=', 'QuestionStyle.id'),
            ).as('style'),
            jsonObjectFrom(
              selectFrom('Answer')
                .select(['Answer.answer', 'Answer.grade'])
                .whereRef('Answer.modelQuestionId', '=', 'ModelQuestion.id')
                .where('Answer.quizId', '=', params.id),
            ).as('userAnswer'),
            jsonObjectFrom(
              selectFrom('ErrorReport')
                .selectAll('ErrorReport')
                .whereRef(
                  'ErrorReport.modelQuestionId',
                  '=',
                  'ModelQuestion.id',
                )
                .where('ErrorReport.quizId', '=', params.id),
            ).as('errorReport'),
          ])
          .whereRef('Quiz.modelId', '=', 'ModelQuestion.modelId')
          .orderBy('ModelQuestion.order', 'asc')
          .$narrowType<{
            style: Selectable<QuestionStyle>
            text: string
            type: QuestionType
          }>(),
      ).as('questions'),
    ])
    .where('Quiz.id', '=', params.id)
    .executeTakeFirst()

  if (!quiz) return notFound()

  const cannotView =
    quiz.examineeId &&
    session?.user.id !== quiz.examineeId &&
    session?.user.role !== 'ADMIN'

  const cannotSubmit =
    !!quiz.submittedAt ||
    (!!quiz.endsAt && quiz.endsAt < new Date()) ||
    session?.user.id != quiz.examineeId

  if (cannotView) return notFound()

  const isOfficiallyCorrected =
    !!(!!quiz.systemExamId && quiz.correctorId) ||
    (!quiz.systemExamId && quiz.correctedAt)

  if (!quiz.enteredAt)
    await db
      .updateTable('Quiz')
      .set({ enteredAt: new Date() })
      .where('id', '=', quiz.id)
      .execute()

  return (
    <div className='container mx-auto py-4'>
      {cannotSubmit && (
        <Alert className='mb-4 border-orange-300 bg-orange-300'>
          <AlertTitle className='flex items-center gap-2'>
            <AlertCircleIcon className='h-4 w-4' />
            هذا لعرض الإختبار فقط ولا يمكنك تسليم الإختبار.
          </AlertTitle>
        </Alert>
      )}
      {!isOfficiallyCorrected && !!quiz.submittedAt && (
        <Alert className='mb-4 border-orange-300 bg-orange-300'>
          <AlertTitle className='flex items-center gap-2'>
            <AlertCircleIcon className='h-4 w-4' />
            هذه النتيجة تقريبية وليست النتيجة النهائية. سيتم اعتماد النتيجة
            النهائية بعد التصحيح اليدوي
          </AlertTitle>
        </Alert>
      )}
      {quiz.grade !== null && (
        <div className='mb-4 flex justify-end'>
          {isOfficiallyCorrected ? (
            <div>
              <p>الدرجة النهائية</p>
              <div className='h-20 w-20 rounded-full border flex flex-col justify-center items-center'>
                <div className='flex flex-col justify-center flex-1'>
                  <p className='text-lg font-bold'>{quiz.grade}</p>
                </div>
                <Separator />
                <div className='flex flex-col justify-center flex-1'>
                  <p className='text-lg font-bold'>{quiz.total}</p>
                </div>
              </div>
            </div>
          ) : (
            <Badge>
              الدرجة التقريبية : {quiz.grade} من {quiz.total}
            </Badge>
          )}
        </div>
      )}
      <h3 className='mb-4 text-center text-lg font-semibold'>
        {!!quiz.systemExamId ? quiz.systemExamName : 'إختبار تجريبي'}
      </h3>
      {cannotSubmit ? (
        <div className='space-y-4'>
          {quiz.questions.map(
            ({ order, id, userAnswer, correctAnswer, style, ...question }) => (
              <div className='flex gap-2' key={id}>
                <div className='text-center'>
                  <p>{order}) </p>
                </div>
                <QuestionCard
                  isCorrect={
                    quiz.correctedAt
                      ? userAnswer?.answer === correctAnswer
                      : undefined
                  }
                  className='flex-1'
                >
                  <QuestionCardText text={question.text} />
                  {question.type === 'WRITTEN' ? (
                    <Textarea
                      readOnly
                      value={
                        userAnswer?.answer ?? quiz.correctedAt
                          ? '(لا يوجد إجابة)'
                          : ''
                      }
                    />
                  ) : (
                    <RadioGroup
                      className='space-y-1'
                      value={userAnswer?.answer ?? undefined}
                      disabled
                    >
                      {style.choicesColumns.map((column) => {
                        const value = question[
                          column as keyof typeof question
                        ] as string

                        return (
                          <div key={value} className='flex items-center gap-2'>
                            <RadioGroupItem value={value} />
                            <Label
                              className={cn(
                                'text-sm font-medium leading-none',
                                value === userAnswer?.answer && 'font-bold',
                              )}
                            >
                              {value}
                            </Label>
                            {quiz.correctedAt ? (
                              value === correctAnswer ? (
                                <CheckIcon className='text-green-600' />
                              ) : (
                                <XIcon className='text-red-500' />
                              )
                            ) : null}
                          </div>
                        )
                      })}
                    </RadioGroup>
                  )}
                  {question.type === 'WRITTEN' && !!quiz.correctedAt && (
                    <p>
                      الإجابة الصحيحة: <strong>{correctAnswer}</strong>
                    </p>
                  )}
                </QuestionCard>
              </div>
            ),
          )}
        </div>
      ) : (
        <QuizForm
          quiz={{
            ...quiz,
            questions: quiz.questions.map((q) => ({
              ...q,
              style: {
                ...q.style,
                choicesColumns: shuffle(q.style?.choicesColumns),
              },
            })),
          }}
        />
      )}
    </div>
  )
}

export default QuizPage
