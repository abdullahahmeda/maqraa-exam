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
  cycleId: undefined as Id,
  setCycleId: (_id: Id) => { return; },
})

export function useDeleteModal() {
  return useContext(ModalContext)
}

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [cycleId, _setCycleId] = useState<Id>()
  const setCycleId = (v: Id) => {
    _setCycleId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        cycleId,
        setCycleId,
      }}
    >
      {children}
      <Modal open={open} id={cycleId} setOpen={setOpen} />
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
  const mutation = api.cycle.delete.useMutation()

  const utils = api.useUtils()
  const deleteCycle = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف الدورة...',
      success: 'تم حذف الدورة بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف الدورة',
    })

    void promise.finally(() => {
      void utils.cycle.invalidate()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا سيحذف هذه الدورة وكل ما يتعلق به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={deleteCycle}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
