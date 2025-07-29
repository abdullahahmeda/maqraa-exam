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
  quizId: undefined as Id,
  setQuizId: (_id: Id) => {},
})

export function useDeleteModal() {
  return useContext(ModalContext)
}

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [quizId, _setQuizId] = useState<Id>()
  const setQuizId = (v: Id) => {
    _setQuizId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        quizId,
        setQuizId,
      }}
    >
      {children}
      <Modal open={open} id={quizId} setOpen={setOpen} />
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
  const mutation = api.quiz.delete.useMutation()

  const utils = api.useUtils()
  const deleteQuiz = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف الإختبار...',
      success: 'تم حذف الإختبار بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف الإختبار',
    })

    void promise.finally(() => {
      void utils.quiz.invalidate()
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
          <AlertDialogAction onClick={deleteQuiz}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
