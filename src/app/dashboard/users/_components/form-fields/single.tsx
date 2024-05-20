import { type Selectable } from 'kysely'
import { EyeIcon, EyeOffIcon, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import {
  type UseFormReturn,
  type FieldValues,
  type FieldPath,
  type PathValue,
  useWatch,
} from 'react-hook-form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import MultipleSelector, { type Option } from '~/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { type UserRole } from '~/kysely/enums'
import type { Cycle } from '~/kysely/types'
import { api } from '~/trpc/react'
import { generateRandomPassword } from '~/utils/strings'
import { userRoleMapping } from '~/utils/users'

type StudentCycles = Option[]
type CorrectorCycles = Option[]
export type NewUserFieldValues = {
  name: string
  email: string
  password: string
  phone: string | null
  role: UserRole
  corrector:
    | {
        cycles: CorrectorCycles
        curricula: Record<string, Option[]>
      }
    | undefined
  student:
    | {
        cycles: StudentCycles
        curricula: Record<
          string,
          {
            courseId: string
            curriculumId: string
            trackId: string
          }
        >
      }
    | undefined
}

export type EditUserFieldValues = NewUserFieldValues & {
  id: string
}

type SingleUserFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  cycles: Selectable<Cycle>[]
}

export function makeEmptyStudentCycle() {
  return {
    courseId: null,
    trackId: null,
    curriculumId: null,
  }
}

export function makeEmptyCorrectorCycle() {
  return {
    courseId: null,
    curricula: [],
  }
}

const StudentCycleForm = <T extends FieldValues>({
  form,
  path,
}: {
  form: UseFormReturn<T>
  path: string
}) => {
  const { data: courses } = api.course.list.useQuery()

  const courseId = useWatch({
    control: form.control,
    name: `${path}.courseId` as FieldPath<T>,
  }) as string | undefined

  const trackId = useWatch({
    control: form.control,
    name: `${path}.trackId` as FieldPath<T>,
  }) as string | undefined

  const { data: tracks } = api.track.list.useQuery(
    { filters: { courseId } },
    { enabled: !!courseId },
  )

  const { data: curricula } = api.curriculum.list.useQuery(
    { filters: { trackId } },
    { enabled: !!trackId },
  )

  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name={`${path}.courseId` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر المقرر' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courses?.data.map((course) => (
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
      <FormField
        control={form.control}
        name={`${path}.trackId` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المسار</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر المسار' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tracks?.data.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
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
        name={`${path}.curriculumId` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المنهج</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر المنهج' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {curricula?.data.map((curriculum) => (
                  <SelectItem key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

const CorrectorCycleForm = <T extends FieldValues>({
  form,
  path,
}: {
  form: UseFormReturn<T>
  path: string
}) => {
  const { data: curricula } = api.curriculum.list.useQuery({
    include: { track: { course: true } },
  })

  return (
    <div>
      <FormField
        control={form.control}
        name={`${path}` as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المناهج</FormLabel>
            <FormControl>
              <MultipleSelector
                placeholder='اختر الدورات'
                defaultOptions={
                  curricula?.data.map((c) => ({
                    label: `${c.track?.course?.name}: ${c.name}`,
                    value: c.id,
                  })) ?? []
                }
                onChange={field.onChange}
                commandProps={{ className: 'h-60' }}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function SingleUserFormFields<T extends FieldValues>({
  form,
  cycles,
}: SingleUserFormProps<T>) {
  const [showPassword, setShowPassword] = useState(true)

  const role = useWatch({
    control: form.control,
    name: 'role' as FieldPath<T>,
  }) as UserRole

  const studentCycles = useWatch({
    control: form.control,
    name: 'student.cycles' as FieldPath<T>,
  }) as StudentCycles

  const correctorCycles = useWatch({
    control: form.control,
    name: 'corrector.cycles' as FieldPath<T>,
  }) as CorrectorCycles

  console.log(form.getValues())

  return (
    <>
      <FormField
        control={form.control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>الاسم</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'email' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>البريد الإلكتروني</FormLabel>
            <FormControl>
              <Input type='email' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'password' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>كلمة المرور</FormLabel>
            <FormControl>
              <div className='flex items-center gap-2'>
                <div className='relative grow flex'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    className='pl-9'
                  />
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          onClick={() => setShowPassword((prev) => !prev)}
                          className='absolute left-1 top-1 h-8 px-2'
                          type='button'
                        >
                          {showPassword ? (
                            <EyeOffIcon className='h-4 w-4' />
                          ) : (
                            <EyeIcon className='h-4 w-4' />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showPassword ? 'إخفاء' : 'إظهار'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant='secondary'
                  className='flex items-center gap-2'
                  type='button'
                  onClick={() =>
                    form.setValue(
                      'password' as FieldPath<T>,
                      generateRandomPassword() as PathValue<T, FieldPath<T>>,
                    )
                  }
                >
                  <RefreshCcwIcon className='h-4 w-4' />
                  توليد
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              كلمة المرور ستظهر عند إنشاءها فقط ولن تظهر مرة أخرى
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'phone' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>رقم الهاتف (اختياري)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'role' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الصلاحيات</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(userRoleMapping).map(([label, value]) => (
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
      {role === 'STUDENT' && (
        <>
          <FormField
            control={form.control}
            name={'student.cycles' as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدورات</FormLabel>
                <FormControl>
                  <MultipleSelector
                    placeholder='اختر الدورات'
                    defaultOptions={cycles.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Accordion type='single' collapsible className='border rounded-md'>
            {(studentCycles ?? []).map((cycle) => (
              <AccordionItem key={cycle.value} value={cycle.value}>
                <AccordionTrigger className='border-b p-2 bg-white'>
                  {cycle.label}
                </AccordionTrigger>
                <AccordionContent className='p-2'>
                  <StudentCycleForm
                    form={form}
                    path={`student.curricula.${cycle.value}`}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
      {role === 'CORRECTOR' && (
        <>
          <FormField
            control={form.control}
            name={'corrector.cycles' as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدورات</FormLabel>
                <FormControl>
                  <MultipleSelector
                    defaultOptions={
                      cycles.map((c) => ({ label: c.name, value: c.id })) ?? []
                    }
                    value={field.value}
                    onChange={(options) => {
                      field.onChange(options)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Accordion type='single' collapsible className='border rounded-md'>
            {(correctorCycles ?? []).map((cycle) => (
              <AccordionItem key={cycle.value} value={cycle.value}>
                <AccordionTrigger className='p-2 border-b bg-white'>
                  {cycle.label}
                </AccordionTrigger>
                <AccordionContent className='p-2'>
                  <CorrectorCycleForm
                    form={form}
                    path={`corrector.curricula.${cycle.value}`}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </>
  )
}
