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
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { toast } from 'sonner'
import { type TRPCError } from '@trpc/server'

type Id = undefined | string

const ModalContext = createContext({
  examId: undefined as Id,
  setExamId: (_id: Id) => { return; },
})

export function useDeleteModal() {
  return useContext(ModalContext)
}

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [examId, _setExamId] = useState<Id>()
  const setExamId = (v: Id) => {
    _setExamId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        examId,
        setExamId,
      }}
    >
      {children}
      <Modal open={open} id={examId} setOpen={setOpen} />
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
  const mutation = api.exam.delete.useMutation()

  const utils = api.useUtils()
  const deleteExam = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف الإختبار...',
      success: 'تم حذف الإختبار بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف الإختبار',
    })

    void promise.finally(() => {
      void utils.exam.invalidate()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا سيحذف هذا الإختبار وكل ما يتعلق به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={deleteExam}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
