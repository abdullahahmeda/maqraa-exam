import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '~/kysely/enums'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/utils/api'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { newUserSchema } from '~/validation/newUserSchema'
import {
  ImportStudentsFieldValues,
  ImportStudentsForm,
} from '../forms/import-users'
import { AddUserFieldValues, UserForm } from '../forms/user'
import { DialogHeader } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'
import { User, Users } from 'lucide-react'
import { generateRandomPassword } from '~/utils/users'

type Props = {
  setDialogOpen: (state: boolean) => void
}

const NewSingleUserTab = ({ setDialogOpen }: Props) => {
  const utils = api.useUtils()

  const form = useForm<AddUserFieldValues>({
    defaultValues: {
      password: generateRandomPassword(),
      role: UserRole.STUDENT,
      student: { cycles: {} },
      corrector: { cycles: {} },
    },
    resolver: zodResolver(newUserSchema),
  })

  const mutation = api.user.create.useMutation()

  const onSubmit = (data: AddUserFieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof newUserSchema>)
      .then(() => {
        toast.success('تم إضافة المستخدم بنجاح')
        setDialogOpen(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.user.invalidate()
      })
  }

  return (
    <UserForm
      form={form}
      onSubmit={onSubmit}
      isLoading={mutation.isPending}
      submitText='إضافة'
    />
  )
}

const ImportStudentsTab = ({ setDialogOpen }: Props) => {
  const form = useForm<ImportStudentsFieldValues>({
    resolver: zodResolver(importUsersSchema),
  })
  const utils = api.useUtils()
  const mutation = api.user.import.useMutation()
  const onSubmit = (data: ImportStudentsFieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof importUsersSchema>)
      .then(() => {
        form.reset()
        toast.success('سيتم إضافة الطلبة')
        setDialogOpen(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.user.invalidate()
      })
  }
  return (
    <ImportStudentsForm
      form={form}
      isLoading={mutation.isPending}
      onSubmit={onSubmit}
    />
  )
}

export const NewUsersDialog = ({ setDialogOpen }: Props) => {
  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة مستخدمين
      </DialogHeader>
      <Tabs defaultValue='single' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='single' className='flex items-center gap-2'>
            <User className='h-4 w-4' />
            مستخدم واحد
          </TabsTrigger>
          <TabsTrigger value='sheet' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            من اكسل (للطلاب)
          </TabsTrigger>
        </TabsList>
        <TabsContent value='single'>
          <NewSingleUserTab setDialogOpen={setDialogOpen} />
        </TabsContent>
        <TabsContent value='sheet'>
          <ImportStudentsTab setDialogOpen={setDialogOpen} />
        </TabsContent>
      </Tabs>
    </>
  )
}
