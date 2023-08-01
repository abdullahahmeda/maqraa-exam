import { UserRole } from '@prisma/client'
import { UseFormReturn, useWatch } from 'react-hook-form'
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

export type AddUserFieldValues = {
  name: string
  email: string
  phone: string
  role: UserRole
  corrector: {
    cycleId: string | undefined
    courseId: string | undefined
  } | undefined
}

export type EditUserFieldValues = { id: string } & AddUserFieldValues

type FormProps = {
  form: UseFormReturn<AddUserFieldValues | EditUserFieldValues>
  onSubmit: (data: AddUserFieldValues | EditUserFieldValues) => void
  isLoading?: boolean
  submitText: string
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

  const { data: cycles, isLoading: isLoadingCycles } =
    api.cycles.findMany.useQuery()

  const { data: courses, isLoading: isLoadingCourses } =
    api.courses.findMany.useQuery()

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
        {role === UserRole.CORRECTOR && (
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
