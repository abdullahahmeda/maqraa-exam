import { UserRole } from '~/kysely/enums'
import { UseFormReturn, useWatch } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '../ui/select'
import { DialogFooter } from '../ui/dialog'
import { generateRandomPassword, userRoleMapping } from '~/utils/users'
import { Button } from '../ui/button'
import { api } from '~/utils/api'
import { MultiSelect } from '../ui/multi-select'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '../ui/accordion'
import difference from 'lodash.difference'
import { Eye, EyeOff, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '../ui/tooltip'

export type AddUserFieldValues = {
  name: string
  email: string
  password: string
  phone: string | null
  role: UserRole
  corrector:
    | {
        cycles: Record<
          string,
          {
            courseId: string
            curricula: string
          }
        >
      }
    | undefined
  student:
    | {
        cycles: Record<
          string,
          {
            courseId: string
            trackId: string
            curriculumId: string
          }
        >
      }
    | undefined
}

export type EditUserFieldValues = { id: string } & AddUserFieldValues

type FormProps = {
  form: UseFormReturn<AddUserFieldValues | EditUserFieldValues>
  onSubmit: (data: AddUserFieldValues | EditUserFieldValues) => void
  isLoading?: boolean
  submitText: string
}

export const makeEmptyStudentCycle = () => ({
  courseId: null,
  trackId: null,
  curriculumId: null,
})

export const makeEmptyCorrectorCycle = () => ({
  // courseId: null,
  curricula: [],
})

const StudentCycleForm = ({
  form,
  path,
}: {
  form: UseFormReturn
  path: string
}) => {
  // const { data: cycles, isLoading: isCyclesLoading } =
  //   api.cycle.findMany.useQuery({})

  const { data: courses, isLoading: isCoursesLoading } =
    api.course.list.useQuery()

  const courseId = useWatch({
    control: form.control,
    name: `${path}.courseId`,
  })
  const trackId = useWatch({
    control: form.control,
    name: `${path}.trackId`,
  })

  const {
    data: tracks,
    isLoading: isTracksLoading,
    fetchStatus: tracksFetchStatus,
  } = api.track.list.useQuery(
    { filters: { courseId } },
    { enabled: !!courseId }
  )

  const {
    isLoading: isCurriculaLoading,
    data: curricula,
    fetchStatus: curriculaFetchStatus,
  } = api.curriculum.list.useQuery(
    { filters: { trackId } },
    { enabled: !!trackId }
  )

  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name={`${path}.courseId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                // loading={isCoursesLoading}
                >
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
        // name='trackId'
        name={`${path}.trackId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المسار</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                // loading={tracksFetchStatus === 'fetching' && isTracksLoading}
                >
                  <SelectValue placeholder='اختر المسار' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tracks?.map((track) => (
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
        // name='curriculumId'
        name={`${path}.curriculumId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المنهج</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                // loading={
                //   curriculaFetchStatus === 'fetching' && isCurriculaLoading
                // }
                >
                  <SelectValue placeholder='اختر المنهج' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {curricula?.map((curriculum) => (
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

const CorrectorCycleForm = ({
  form,
  path,
}: {
  form: UseFormReturn
  path: string
}) => {
  // const { data: cycles, isLoading: isCyclesLoading } =
  //   api.cycle.findMany.useQuery({})

  const { data: curricula, isLoading: isCurriculaLoading } =
    api.curriculum.list.useQuery(
      { include: { track: true } },
      {
        select: (data) =>
          data.map((c) => ({ ...c, label: `${c.courseName}: ${c.name}` })),
      }
    )

  return (
    <div>
      <FormField
        control={form.control}
        name={`${path}.curricula`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المناهج</FormLabel>
            <FormControl>
              <MultiSelect
                placeholder='اختر الدورات'
                items={(curricula as any) || []}
                labelKey='label'
                valueKey='id'
                onSelect={field.onChange}
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

export const UserForm = ({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: FormProps) => {
  const role = useWatch({
    control: form.control,
    name: 'role',
  })

  const [showPassword, setShowPassword] = useState(true)

  const studentCycles = useWatch({
    control: form.control,
    name: 'student.cycles',
  })

  const correctorCycles = useWatch({
    control: form.control,
    name: 'corrector.cycles',
  })

  const { data: cycles, isLoading: isLoadingCycles } = api.cycle.list.useQuery()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
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
          name='email'
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
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <div className='flex items-center gap-2'>
                  <div className='relative grow'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            onClick={() => setShowPassword((prev) => !prev)}
                            className='absolute left-1 top-1 h-8 px-2'
                            type='button'
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
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
                      form.setValue('password', generateRandomPassword())
                    }
                  >
                    <RefreshCcw className='h-4 w-4' />
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
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف (اختياري)</FormLabel>
              <FormControl>
                {/* @ts-ignore */}
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الصلاحيات</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر الصلاحية' />
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
              name='student.cycles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدورات</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder='اختر الدورات'
                      items={(cycles?.data as any) || []}
                      labelKey='name'
                      valueKey='id'
                      onSelect={(newValue: string[]) => {
                        const currentValue = Object.keys(studentCycles)
                        if (newValue.length > currentValue.length) {
                          const diff = difference(
                            newValue,
                            currentValue
                          )[0] as string
                          field.onChange({
                            ...studentCycles,
                            [diff]: makeEmptyStudentCycle(),
                          })
                        } else if (currentValue.length > newValue.length) {
                          const diff = difference(
                            currentValue,
                            newValue
                          )[0] as string
                          const obj = { ...studentCycles }
                          delete obj[diff]
                          field.onChange(obj)
                        }
                      }}
                      value={Object.keys(field.value)}
                    />
                  </FormControl>
                  <FormMessage className='!mt-0' />
                </FormItem>
              )}
            />
            <Accordion type='single' collapsible>
              {Object.entries(studentCycles).map(([cycleId, fields]) => (
                <AccordionItem key={cycleId} value={cycleId}>
                  <AccordionTrigger className='rounded bg-gray-100 p-2'>
                    {cycles?.data.find((c) => c.id === cycleId)?.name}
                  </AccordionTrigger>
                  <AccordionContent className='p-2'>
                    <StudentCycleForm
                      form={form as any}
                      path={`student.cycles.${cycleId}`}
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
              name='corrector.cycles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدورات</FormLabel>
                  <FormControl>
                    <MultiSelect
                      items={cycles?.data || []}
                      labelKey='name'
                      valueKey='id'
                      onSelect={(newValue: string[]) => {
                        const currentValue = Object.keys(correctorCycles)
                        if (newValue.length > currentValue.length) {
                          const diff = difference(
                            newValue,
                            currentValue
                          )[0] as string
                          field.onChange({
                            ...correctorCycles,
                            [diff]: makeEmptyCorrectorCycle(),
                          })
                        } else if (currentValue.length > newValue.length) {
                          const diff = difference(
                            currentValue,
                            newValue
                          )[0] as string
                          const obj = { ...correctorCycles }
                          delete obj[diff]
                          field.onChange(obj)
                        }
                      }}
                      value={Object.keys(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion type='single' collapsible>
              {Object.entries(correctorCycles).map(([cycleId, fields]) => (
                <AccordionItem key={cycleId} value={cycleId}>
                  <AccordionTrigger className='rounded bg-gray-100 p-2'>
                    {cycles?.data.find((c) => c.id === cycleId)?.name}
                  </AccordionTrigger>
                  <AccordionContent className='p-2'>
                    <CorrectorCycleForm
                      form={form as any}
                      path={`corrector.cycles.${cycleId}`}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
