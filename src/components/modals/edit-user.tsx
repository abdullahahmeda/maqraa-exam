import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditUserFieldValues, UserForm } from '../forms/user'
import { UserRole } from '@prisma/client'
import { api } from '~/utils/api'
import { updateUserSchema } from '~/validation/updateUserSchema'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { DialogHeader } from '../ui/dialog'

export const EditUserDialog = ({
  id,
  setDialogOpen,
}: {
  id: string
  setDialogOpen: (state: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<EditUserFieldValues>({
    resolver: zodResolver(updateUserSchema),
  })
  const {
    data: user,
    isLoading,
    error,
  } = api.users.findFirstOrThrow.useQuery(
    { where: { id } },
    { enabled: id != null }
  )
  const userUpdate = api.users.update.useMutation()

  useEffect(() => {
    if (user)
      form.reset({
        id: user.id,
        name: user.name!,
        email: user.email!,
        role: user.role! as UserRole,
      })
  }, [user, form])

  const onSubmit = (data: EditUserFieldValues) => {
    userUpdate
      .mutateAsync({
        ...data,
        role: data.role as UserRole,
      })
      .then(() => {
        toast({ title: 'تم تعديل بيانات المستخدم بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        form.setError('root.serverError', {
          message: error.message || 'حدث خطأ غير متوقع',
        })
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center gap-2 text-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
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
      <DialogHeader className='mb-2'>تعديل بيانات مستخدم</DialogHeader>
      <UserForm
        form={form as any}
        onSubmit={onSubmit as any}
        submitText='تعديل'
        isLoading={userUpdate.isLoading}
      />
    </>
  )
}
