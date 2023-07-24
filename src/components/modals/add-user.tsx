import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../ui/tabs'
import { AddUserFieldValues, UserForm } from '../forms/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'
import { api } from '~/utils/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { newUserSchema } from '~/validation/newUserSchema'
import {
  ImportStudents,
  ImportStudentsFieldValues,
} from '../forms/import-users'
import { importUsersSchema } from '~/validation/importUsersSchema'
import { DialogHeader } from '../ui/dialog'

type Props = {
  setDialogOpen: (state: boolean) => void
}

const AddSingleUserTab = ({ setDialogOpen }: Props) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<AddUserFieldValues>({
    defaultValues: { role: UserRole.STUDENT },
    resolver: zodResolver(newUserSchema),
  })

  const userCreate = api.users.create.useMutation()

  const onSubmit = (data: AddUserFieldValues) => {
    const t = toast({ title: 'جاري إضافة المستخدم' })
    userCreate
      .mutateAsync(data as z.infer<typeof newUserSchema>)
      .then(() => {
        t.dismiss()
        form.reset()
        toast({ title: 'تم إضافة المستخدم بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }

  return (
    <UserForm
      form={form}
      onSubmit={onSubmit}
      isLoading={userCreate.isLoading}
      submitText='إضافة'
    />
  )
}

const ImportStudentsTab = ({ setDialogOpen }: Props) => {
  const form = useForm<ImportStudentsFieldValues>({
    resolver: zodResolver(importUsersSchema),
  })
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const studentsImport = api.users.importStudents.useMutation()
  const onSubmit = (data: ImportStudentsFieldValues) => {
    const t = toast({ title: 'جاري إضافة الطلبة' })
    studentsImport
      .mutateAsync(data as z.infer<typeof importUsersSchema>)
      .then(() => {
        t.dismiss()
        form.reset()
        toast({ title: 'تم إضافة الطلبة بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['users']])
      })
  }
  return (
    <ImportStudents
      form={form}
      isLoading={studentsImport.isLoading}
      onSubmit={onSubmit}
    />
  )
}

export const AddUsersDialog = ({ setDialogOpen }: Props) => {
  return (
    <>
      <DialogHeader className='mb-2'>إضافة مستخدمين</DialogHeader>
      <Tabs defaultValue='single' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='single'>مستخدم واحد</TabsTrigger>
          <TabsTrigger value='sheet'>من اكسل شيت (طلاب فقط)</TabsTrigger>
        </TabsList>
        <TabsContent value='single'>
          <AddSingleUserTab setDialogOpen={setDialogOpen} />
        </TabsContent>
        <TabsContent value='sheet'>
          <ImportStudentsTab setDialogOpen={setDialogOpen} />
        </TabsContent>
      </Tabs>
    </>
  )
}
