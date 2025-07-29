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
  questionId: undefined as Id,
  setQuestionId: (_id: Id) => { return; },
})

export function useDeleteModal() {
  return useContext(ModalContext)
}

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [questionId, _setQuestionId] = useState<Id>()
  const setQuestionId = (v: Id) => {
    _setQuestionId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        questionId,
        setQuestionId,
      }}
    >
      {children}
      <Modal open={open} id={questionId} setOpen={setOpen} />
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
  const mutation = api.question.delete.useMutation()

  const utils = api.useUtils()
  const deleteQuestion = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف السؤال...',
      success: 'تم حذف السؤال بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف السؤال',
    })

    void promise.finally(() => {
      void utils.question.invalidate()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا سيحذف هذا السؤال وكل ما يتعلق به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={deleteQuestion}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
