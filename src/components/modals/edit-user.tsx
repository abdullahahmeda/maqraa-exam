import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditUserFieldValues, UserForm } from '../forms/user'
import { api } from '~/utils/api'
import { editUserSchema } from '~/validation/editUserSchema'
import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'
import { DialogHeader } from '../ui/dialog'
import { useSession } from 'next-auth/react'
import mapValues from 'lodash.mapvalues'
import { z } from 'zod'

export const EditUserDialog = ({
  id,
  setDialogOpen,
}: {
  id: string
  setDialogOpen: (state: boolean) => void
}) => {
  const utils = api.useUtils()
  const form = useForm<EditUserFieldValues>({
    resolver: zodResolver(editUserSchema),
  })
  const {
    data: user,
    isLoading,
    error,
  } = api.user.get.useQuery(
    {
      id,
      include: { cycles: true },
    },
    { enabled: id != null }
  )
  const mutation = api.user.update.useMutation()

  const { data: session } = useSession()

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT')
        form.reset({
          ...user,
          student: {
            cycles: user?.cycles?.reduce(
              (acc: object, cycle) => ({
                ...acc,
                [cycle.cycleId]: {
                  id: cycle.id,
                  courseId: cycle.courseId,
                  trackId: cycle.trackId,
                  curriculumId: cycle.curriculumId,
                },
              }),
              {}
            ),
          },
          corrector: { cycles: {} },
        })
      else if (user.role === 'CORRECTOR')
        form.reset({
          ...user,
          corrector: {
            cycles: user?.cycles?.reduce(
              (acc: object, cycle) => ({
                ...acc,
                [cycle.cycleId]: {
                  id: cycle.id,
                  curricula:
                    user.cycles
                      ?.filter((c) => c.cycleId === cycle.cycleId)
                      .map((c) => c.curriculumId) ?? [],
                },
              }),
              {}
            ),
          },
          student: { cycles: {} },
        } as any)
      // Please leave me alone, typescript
      else
        form.reset(
          mapValues(
            { ...user, corrector: { cycles: {} }, student: { cycles: {} } },
            (value: any) => value ?? undefined
          )
        )
    }
  }, [user, form])

  const onSubmit = (data: EditUserFieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof editUserSchema>)
      .then(() => {
        toast.success('تم تعديل بيانات المستخدم بنجاح')
        if (id === session!.user.id)
          toast.success('قم بإعادة تسجيل الدخول لتفعيل الصلاحية الجديدة')
        setDialogOpen(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.user.invalidate()
      })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center gap-2 text-center'>
        <Loader2Icon className='h-4 w-4 animate-spin' />
        <p>جاري التحميل</p>
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        تعديل بيانات مستخدم
      </DialogHeader>
      <UserForm
        form={form as any}
        onSubmit={onSubmit as any}
        submitText='تعديل'
        isLoading={mutation.isPending}
      />
    </>
  )
}
