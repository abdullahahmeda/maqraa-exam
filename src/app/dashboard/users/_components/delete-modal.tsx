'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/trpc/react'
import { Spinner } from '~/components/ui/spinner'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { toast } from 'sonner'
import { type TRPCError } from '@trpc/server'

type Id = undefined | string

const ModalContext = createContext({
  userId: undefined as Id,
  setUserId: (_id: Id) => {},
})

export function useDeleteModal() {
  return useContext(ModalContext)
}

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [userId, _setUserId] = useState<Id>()
  const setUserId = (v: Id) => {
    _setUserId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        userId,
        setUserId,
      }}
    >
      {children}
      <Modal open={open} id={userId} setOpen={setOpen} />
    </ModalContext.Provider>
  )
}

function Modal({
  open,
  id,
  setOpen,
}: {
  open: boolean
  id: Id
  setOpen: (v: boolean) => void
}) {
  const mutation = api.user.delete.useMutation()

  const utils = api.useUtils()
  const deleteUser = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف المستخدم...',
      success: 'تم حذف المستخدم بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف المستخدم',
    })

    void promise.finally(() => {
      void utils.user.invalidate()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا سيحذف هذا المستخدم وكل ما يتعلق به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteUser(id!)}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
