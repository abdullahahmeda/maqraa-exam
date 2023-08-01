import { AccordionTrigger, AccordionItem, AccordionContent } from "./ui/accordion"
import { Button } from "./ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form"
import { FormControl, FormItem, FormMessage, FormField, FormLabel } from "./ui/form"
import { Trash } from "lucide-react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { difficultyMapping, styleMapping, typeMapping } from "~/utils/questions"
import { CSS } from '@dnd-kit/utilities'
import { QuestionDifficulty, QuestionStyle, QuestionType } from "@prisma/client"

export type Group = {
  number: number
  gradePerQuestion: number
  difficulty: QuestionDifficulty | string | undefined
  styleOrType: QuestionStyle | QuestionType | string | undefined
}

type FieldValues = {
  groups: Group[]
}

export const QuestionGroup = ({
  id,
  index,
  form,
  remove,
}: {
  id: string
  index: number
  form: UseFormReturn<FieldValues>
  remove: UseFieldArrayRemove
}) => {
  const {
    attributes: { role, ...attributes },
    listeners,
    setNodeRef,
    transform,
  } = useSortable({ id })

  const style = { transform: CSS.Transform.toString(transform) }

  return (
    <AccordionItem
      value={id}
      ref={setNodeRef}
      {...attributes}
      style={style}
      className='transition-transform last-of-type:border-b-0'
    >
      <AccordionTrigger {...listeners} className='bg-gray-50 p-3'>
        المجموعة {index + 1}
      </AccordionTrigger>
      <AccordionContent className='bg-gray-50/50'>
        <div className='space-y-4 p-3'>
          <div className='flex justify-end'>
            <Button
              size='icon'
              variant='destructive'
              onClick={() => remove(index)}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex gap-2'>
            <FormField
              control={form.control}
              name={`groups.${index}.number`}
              render={({ field }) => (
                <FormItem className='flex-grow'>
                  <FormLabel>عدد الأسئلة</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`groups.${index}.gradePerQuestion`}
              render={({ field }) => (
                <FormItem className='flex-grow'>
                  <FormLabel>الدرجة للسؤال</FormLabel>
                  <FormControl>
                    <Input min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`groups.${index}.difficulty`}
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
                    <SelectItem value=''>عشوائي</SelectItem>
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
            name={`groups.${index}.styleOrType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الأسئلة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='اختر طريقة الأسئلة' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=''>عشوائي</SelectItem>
                    {Object.entries(typeMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {Object.entries(styleMapping).map(([label, value]) => (
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
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
