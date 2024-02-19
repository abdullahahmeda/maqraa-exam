import { Question, QuestionStyle } from '~/kysely/types'
import { Badge } from '~/components/ui/badge'
import { Selectable } from 'kysely'
import { formatNumber } from '~/utils/strings'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './tooltip'
import { Button, ButtonProps } from './button'
import { AlertTriangleIcon, CheckIcon, XIcon } from 'lucide-react'
import { Textarea } from './textarea'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { cn } from '~/lib/utils'
import { ComponentPropsWithoutRef } from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { Fields } from '~/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

const QuestionAnswer = <T extends FieldValues>({
  question,
  form,
  field,
  style,
}: {
  question: Selectable<Question>
  form: UseFormReturn<T>
  field: FieldPath<T>
  style?: QuestionStyle | undefined
}) => {
  const { control } = form
  if (question.type === 'WRITTEN') {
    return (
      <FormField
        control={control}
        name={field}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {(question as any).correctAnswer ? 'إجابتك' : 'الإجابة'}
            </FormLabel>
            <FormControl>
              <Textarea {...field} disabled={(question as any).correctAnswer} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormField
      control={control}
      name={field}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>
            {(question as any).correctAnswer ? 'إجابتك' : 'اختر الإجابة'}
          </FormLabel>
          <FormControl>
            <RadioGroup
              value={value}
              onValueChange={onChange}
              className='space-y-1'
              disabled={(question as any).correctAnswer}
            >
              {style?.choicesColumns.map((column) => {
                const value = question[
                  column as keyof typeof question
                ] as string
                return (
                  <FormItem
                    className='flex items-center gap-2 space-y-0'
                    key={value}
                  >
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel>{value}</FormLabel>
                  </FormItem>
                )
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FieldKeys = 'answer'

type FormFields<T extends FieldValues> = Fields<FieldKeys, T>

type Props<T extends FieldValues> = {
  question: Selectable<Question>
  style?: QuestionStyle
  weight?: number
  showQuestionStyle?: boolean
  showQuestionNumber?: boolean
  showHadithNumber?: boolean
  showPageNumber?: boolean
  showPartNumber?: boolean
  form?: UseFormReturn<T>
  fields?: FormFields<T>
} & ComponentPropsWithoutRef<'div'>

export const QuestionCard = <T extends FieldValues>({
  question,
  style,
  weight,
  showQuestionStyle = true,
  showQuestionNumber = false,
  showHadithNumber = false,
  showPartNumber = false,
  showPageNumber = false,
  form,
  fields,
  className,
  ...props
}: Props<T>) => {
  const userAnswer = form?.getValues(fields?.answer as FieldPath<T>)
  return (
    <div
      className={cn('flex flex-col gap-2 md:flex-row', className)}
      {...props}
    >
      <div
        className={cn(
          'relative flex-1 space-y-2 rounded-md bg-white p-4 shadow',
          !!(question as any).correctAnswer && {
            'bg-green-100': (question as any).correctAnswer === userAnswer,
            'bg-red-50': (question as any).correctAnswer !== userAnswer,
          }
        )}
      >
        {!!(question as any).correctAnswer && (
          <div className='absolute left-0 top-0'>
            {(question as any).correctAnswer === userAnswer ? (
              <CheckIcon className='h-28 w-28 text-green-800 opacity-25' />
            ) : (
              <XIcon className='h-28 w-28 text-red-800 opacity-25' />
            )}
          </div>
        )}
        <div className='flex items-baseline gap-2'>
          {showQuestionStyle && (
            <Badge className='whitespace-nowrap' variant='outline'>
              {style?.name}
            </Badge>
          )}
          {weight !== undefined && (
            <Badge className='whitespace-nowrap' variant='outline'>
              {formatNumber(weight, {
                zero: '',
                few: 'درجات',
                many: 'درجة',
                other: 'درجة',
                one: 'درجة واحدة',
                two: 'درجتان',
              })}
            </Badge>
          )}
          {showQuestionNumber && (
            <Badge className='whitespace-nowrap' variant='outline'>
              السؤال: {question.number}
            </Badge>
          )}
          {showPartNumber && (
            <Badge className='whitespace-nowrap' variant='outline'>
              الجزء: {question.partNumber}
            </Badge>
          )}
          {showPageNumber && (
            <Badge className='whitespace-nowrap' variant='outline'>
              الصفحة: {question.pageNumber}
            </Badge>
          )}
          {showHadithNumber && (
            <Badge className='whitespace-nowrap' variant='outline'>
              الحديث: {question.hadithNumber}
            </Badge>
          )}
        </div>
        <div>
          <p className='[overflow-wrap:anywhere]'>{question.text}</p>
        </div>
        {form && fields?.answer && (
          <QuestionAnswer
            form={form}
            field={fields.answer}
            question={question}
            style={style}
          />
        )}
        {(question as any).correctAnswer && (
          <p className='mt-2'>
            الإجابة الصحيحة: <strong>{(question as any).correctAnswer}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
