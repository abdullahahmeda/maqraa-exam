import { Input } from '~/components/ui/input'
import { api } from '~/utils/api'
import { useState, useEffect, useRef } from 'react'
import { Loader2, Loader2Icon, SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useInView } from 'react-intersection-observer'
import { FormFieldsCommonProps } from './questions-group'
import { QuestionCard } from './ui/question-card'
import { Selectable } from 'kysely'
import { FormItem, FormLabel, FormControl } from './ui/form'
import { Question } from '~/kysely/types'

type Props =
  | FormFieldsCommonProps & {
      groupQuestions: Record<string, Selectable<Question>>
    }

export const ManualQuestionsFormFields = ({
  setGroupQuestions,
  getCommonFilters,
  validateCommonFilters,
  groupQuestions,
}: Props) => {
  const questionNumberRef = useRef<null | HTMLInputElement>(null)
  const partNumberRef = useRef<null | HTMLInputElement>(null)
  const pageNumberRef = useRef<null | HTMLInputElement>(null)
  const hadithNumberRef = useRef<null | HTMLInputElement>(null)

  const [validData, setValidData] = useState(false)

  const validateDataForFetching = validateCommonFilters

  const rootRef = useRef<null | HTMLDivElement>(null)

  const { ref, inView } = useInView({
    rootMargin: '0px 0px 400px 0px',
    root: rootRef.current,
  })

  const {
    data: questions,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetched,
  } = api.question.infiniteList.useInfiniteQuery(
    {
      filters: {
        ...getCommonFilters(),
        number: questionNumberRef.current?.value || undefined,
        partNumber: partNumberRef.current?.value || undefined,
        pageNumber: pageNumberRef.current?.value || undefined,
        hadithNumber: hadithNumberRef.current?.value || undefined,
      },
      include: { style: true },
    },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const searchQuestions = async () => {
    const isValidData = await validateDataForFetching()
    if (!isValidData) {
      setValidData(false)
      return
    }
    setValidData(true)

    refetch()
  }

  useEffect(() => {
    searchQuestions()
  }, [])

  useEffect(() => {
    if (inView && isFetched && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView])

  const addOrRemoveQuestion = (question: Selectable<Question>) => {
    setGroupQuestions((oldQuestions) => {
      if (oldQuestions[question.id]) {
        delete oldQuestions[question.id]
        return Object.values(oldQuestions)
      }
      oldQuestions[question.id] = question
      return Object.values(oldQuestions)
    })
  }

  return (
    <div>
      <div className='mb-4 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <FormItem>
              <FormLabel>رقم السؤال</FormLabel>
              <FormControl>
                <Input type='number' ref={questionNumberRef} />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الجزء</FormLabel>
              <FormControl>
                <Input type='number' ref={partNumberRef} />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الصفحة</FormLabel>
              <FormControl>
                <Input type='number' ref={pageNumberRef} />
              </FormControl>
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FormLabel>رقم الحديث</FormLabel>
              <FormControl>
                <Input type='number' ref={hadithNumberRef} />
              </FormControl>
            </FormItem>
          </div>
        </div>
        <Button
          type='button'
          className='gap-2'
          onClick={searchQuestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <SearchIcon className='h-4 w-4' />
          )}
          بحث
        </Button>
      </div>

      <div
        className='max-h-96 overflow-auto rounded-md bg-gray-50 p-4'
        ref={rootRef}
      >
        <div className='space-y-4'>
          {questions?.pages.flatMap((page) =>
            page.data.map((question) => (
              <div key={question.id} className='flex items-center gap-2'>
                <Checkbox
                  onCheckedChange={() => addOrRemoveQuestion(question)}
                  checked={groupQuestions[question.id] !== undefined}
                />
                <QuestionCard
                  key={question.id}
                  question={question}
                  showPageNumber
                  showPartNumber
                  showHadithNumber
                  className='flex-1'
                />
              </div>
            ))
          )}
        </div>
        <div ref={ref} />
        {validData ? (
          (isLoading || hasNextPage) && (
            <div className='m-4 flex justify-center'>
              <Loader2Icon className='animate-spin' />
            </div>
          )
        ) : (
          <p className='text-center'>
            قم بتعبئة الحقول اللازمة أولاُ ثم اضغط على زر البحث
          </p>
        )}
      </div>
    </div>
  )
}
