import { UserRole } from '@prisma/client'
import { UseFormReturn, useFieldArray, useWatch } from 'react-hook-form'
import {
  Form,
  FormControl,
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
import { userRoleMapping } from '~/utils/users'
import { Button } from '../ui/button'
import { api } from '~/utils/api'
import { Combobox } from '../ui/combobox'
import { MultiSelect } from '../ui/multi-select'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '../ui/accordion'
import difference from 'lodash.difference'

export type AddUserFieldValues = {
  name: string
  email: string
  phone: string
  role: UserRole
  corrector:
    | {
        cycleId: string | undefined
        courseId: string | undefined
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

export const makeEmptyCycle = () => ({
  courseId: null,
  trackId: null,
  curriculumId: null,
})

const CycleForm = ({ form, path }: { form: UseFormReturn; path: string }) => {
  // const { data: cycles, isLoading: isCyclesLoading } =
  //   api.cycles.findMany.useQuery({})

  const { data: courses, isLoading: isCoursesLoading } =
    api.courses.findMany.useQuery({})

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
  } = api.tracks.findMany.useQuery(
    { where: { courseId } },
    { enabled: !!courseId }
  )

  const {
    isLoading: isCurriculaLoading,
    data: curricula,
    fetchStatus: curriculaFetchStatus,
  } = api.curricula.findMany.useQuery(
    { where: { trackId } },
    {
      enabled: !!trackId,
      queryKey: [
        'curricula.findMany',
        {
          where: { track: { id: trackId, courseId } },
        },
      ],
    }
  )

  return (
    <div className='space-y-4'>
      {/* <FormField
        control={form.control}
        name='cycleId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>الدورة</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger loading={isCyclesLoading}>
                  <SelectValue placeholder='اختر الدورة' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cycles?.map((cycle) => (
                  <SelectItem key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      <FormField
        control={form.control}
        name={`${path}.courseId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger loading={isCoursesLoading}>
                  <SelectValue placeholder='اختر المقرر' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courses?.map((course) => (
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
                  loading={tracksFetchStatus === 'fetching' && isTracksLoading}
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
                  loading={
                    curriculaFetchStatus === 'fetching' && isCurriculaLoading
                  }
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

  // const {
  //   fields: studentCycles,
  //   remove,
  //   append,
  // } = useFieldArray({
  //   control: form.control,
  //   name: 'student.cycles',
  // })

  const studentCycles = useWatch({
    control: form.control,
    name: 'student.cycles',
  })

  const { data: cycles, isLoading: isLoadingCycles } =
    api.cycles.findMany.useQuery({})

  const { data: courses, isLoading: isLoadingCourses } =
    api.courses.findMany.useQuery({})

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
          name='phone'
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
                      items={(cycles as any) || []}
                      labelKey='name'
                      valueKey='id'
                      // onSelect={field.onChange}
                      onSelect={(newValue: string[]) => {
                        const currentValue = Object.keys(studentCycles)
                        if (newValue.length > currentValue.length) {
                          const diff = difference(
                            newValue,
                            currentValue
                          )[0] as string
                          field.onChange({
                            ...studentCycles,
                            [diff]: makeEmptyCycle(),
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
                    {cycles?.find((c) => c.id === cycleId)?.name}
                  </AccordionTrigger>
                  <AccordionContent className='p-2'>
                    <CycleForm
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
              name='corrector.cycleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدورة</FormLabel>
                  <FormControl>
                    <Combobox
                      items={cycles || []}
                      loading={isLoadingCycles}
                      labelKey='name'
                      valueKey='id'
                      onSelect={field.onChange}
                      value={field.value}
                      triggerText='اختر'
                      triggerClassName='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='corrector.courseId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المقرر</FormLabel>
                  <Combobox
                    items={courses || []}
                    loading={isLoadingCourses}
                    labelKey='name'
                    valueKey='id'
                    onSelect={field.onChange}
                    value={field.value}
                    triggerText='اختر'
                    triggerClassName='w-full'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
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
