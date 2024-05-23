'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Selectable } from 'kysely'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Spinner } from '~/components/ui/spinner'
import { type QuestionDifficulty } from '~/kysely/enums'
import type { Course } from '~/kysely/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { populateFormWithErrors } from '~/utils/errors'
import { difficultyMapping } from '~/utils/questions'
import { createQuizSchema } from '~/validation/backend/mutations/quiz/create'

type FieldValues = {
  courseId: string
  from: {
    part: string
    page: string
    hadith: string
  }
  to: {
    part: string
    page: string
    hadith: string
  }
  repeatFromSameHadith: boolean
  questionsNumber: number
  difficulty: QuestionDifficulty | 'all'
}

export const StartQuizForm = ({
  courses,
}: {
  courses: Selectable<Course>[]
}) => {
  const router = useRouter()

  const form = useForm<FieldValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      repeatFromSameHadith: false,
      questionsNumber: 25,
      difficulty: 'all',
    },
  })

  const quizCreate = api.quiz.create.useMutation({
    onSuccess: (quiz) => router.push(`/quiz/${quiz.id}`),
    onError: (error) => {
      populateFormWithErrors(form, error)
      toast.error('لم يتم تسليم الاختبار')
    },
  })

  const courseId = useWatch({ control: form.control, name: 'courseId' })
  const fromPart = useWatch({ control: form.control, name: 'from.part' })
  const toPart = useWatch({ control: form.control, name: 'to.part' })
  const fromPage = useWatch({ control: form.control, name: 'from.page' })
  const toPage = useWatch({ control: form.control, name: 'to.page' })
  const fromHadith = useWatch({ control: form.control, name: 'from.hadith' })
  const toHadith = useWatch({ control: form.control, name: 'to.hadith' })
  const difficulty = useWatch({ control: form.control, name: 'difficulty' })
  const repeatFromSameHadith = useWatch({
    control: form.control,
    name: 'repeatFromSameHadith',
  })

  const {
    data: questionsInfo,
    isLoading: isQuestionsInfoLoading,
    fetchStatus: questionsInfoFetchStatus,
    dataUpdatedAt,
  } = api.quiz.getQuestionsInfo.useQuery(
    {
      courseId,
      fromPart,
      toPart,
      fromPage,
      toPage,
      fromHadith,
      toHadith,
      difficulty,
      repeatFromSameHadith: repeatFromSameHadith as boolean | undefined,
    },
    { enabled: !!courseId },
  )

  const fromParts =
    toPart != undefined
      ? questionsInfo?.parts.filter((p) => p <= Number(toPart))
      : questionsInfo?.parts

  const toParts =
    fromPart != undefined
      ? questionsInfo?.parts.filter((p) => p >= Number(fromPart))
      : questionsInfo?.parts

  const fromPages =
    fromPart != undefined && fromPart === toPart && toPage != undefined
      ? questionsInfo?.fromPages?.filter((p) => p <= Number(toPage))
      : questionsInfo?.fromPages

  const toPages =
    fromPart != undefined && fromPart === toPart && fromPage != undefined
      ? questionsInfo?.toPages?.filter((p) => p >= Number(fromPage))
      : questionsInfo?.toPages

  const fromHadiths =
    fromPart != undefined &&
    fromPart === toPart &&
    toPage != undefined &&
    fromPage === toPage &&
    toHadith != undefined
      ? questionsInfo?.fromHadiths?.filter((h) => h <= Number(toHadith))
      : questionsInfo?.fromHadiths

  const toHadiths =
    fromPart != undefined &&
    fromPart === toPart &&
    fromPage != undefined &&
    fromPage === toPage &&
    fromHadith != undefined
      ? questionsInfo?.toHadiths?.filter((h) => h >= Number(fromHadith))
      : questionsInfo?.toHadiths

  useEffect(() => {
    if (
      questionsInfo?.questions !== undefined &&
      form.getValues('questionsNumber')
    ) {
      form.setValue(
        'questionsNumber',
        Math.min(
          Number(form.getValues('questionsNumber')),
          questionsInfo.questions,
          25,
        ),
      )
    }
  }, [dataUpdatedAt])

  const onSubmit = (data: FieldValues) => {
    quizCreate.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='courseId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكتاب</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCoursesLoading}
                  >
                    <SelectValue placeholder='اختر الكتاب' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='relative'>
          {questionsInfoFetchStatus === 'fetching' &&
            isQuestionsInfoLoading && (
              <div className='absolute inset-0 z-50 flex items-center justify-center'>
                <Spinner className='text-zinc-500' size={48} />
              </div>
            )}
          <div
            className={cn(
              'grid grid-cols-[1fr_1px_1fr] gap-4',
              questionsInfoFetchStatus === 'fetching' &&
                isQuestionsInfoLoading &&
                'opacity-50',
            )}
          >
            <div className='space-y-2'>
              <h3 className='text-lg'>من</h3>
              <FormField
                control={form.control}
                name='from.part'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الجزء أو المجلد</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fromParts?.map((part) => (
                          <SelectItem key={part} value={'' + part}>
                            {part}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='from.page'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الصفحة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fromPages?.map((page) => (
                          <SelectItem key={page} value={'' + page}>
                            {page}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='from.hadith'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الحديث</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fromHadiths?.map((hadith) => (
                          <SelectItem key={hadith} value={'' + hadith}>
                            {hadith}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator orientation='vertical' />
            <div className='space-y-2'>
              <h3 className='text-lg'>إلى</h3>
              <FormField
                control={form.control}
                name='to.part'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الجزء أو المجلد</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toParts?.map((part) => (
                          <SelectItem key={part} value={'' + part}>
                            {part}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='to.page'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الصفحة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toPages?.map((page) => (
                          <SelectItem key={page} value={'' + page}>
                            {page}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='to.hadith'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الحديث</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                        // loading={
                        //   questionsInfoFetchStatus === 'fetching' &&
                        //   isQuestionsInfoLoading
                        // }
                        >
                          <SelectValue placeholder='اختر' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toHadiths?.map((hadith) => (
                          <SelectItem key={hadith} value={'' + hadith}>
                            {hadith}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name='repeatFromSameHadith'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 space-x-reverse'>
              <FormControl>
                <Checkbox
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>السماح بأكثر من سؤال في نفس الحديث</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='difficulty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المستوى</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر المستوى' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='all'>كل المستويات</SelectItem>
                  {Object.entries(difficultyMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`questionsNumber`}
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormLabel>عدد الأسئلة</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={1}
                  max={questionsInfo?.questions}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={quizCreate.isPending}>بدأ الاختبار</Button>
      </form>
    </Form>
  )
}
