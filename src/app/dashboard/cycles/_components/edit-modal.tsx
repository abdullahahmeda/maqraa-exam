'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditCycleForm } from './edit-form'
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'
import { type ReactNode, createContext, useState, useContext } from 'react'

type Id = undefined | string

const ModalContext = createContext({
  cycleId: undefined as Id,
  setCycleId: (_id: Id) => { return; },
})

export function useEditModal() {
  return useContext(ModalContext)
}

export function EditModalProvider({ children }: { children: ReactNode }) {
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

function Content({ id }: { id: string }) {
  const {
    data: cycle,
    isPending: isCyclePending,
    isError: isCycleError,
  } = api.cycle.getOneForEdit.useQuery({ id }, { enabled: id != undefined })
  const {
    data: curricula,
    isError: isCurriculaError,
    isPending: isCurriculaPending,
  } = api.curriculum.getList.useQuery()

  const isError = isCycleError || isCurriculaError
  const isPending = isCyclePending || isCurriculaPending

  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء تحميل البيانات</p>
  }
  if (isPending) {
    return (
      <div className='flex justify-center'>
        <Spinner className='h-4 w-4' />
      </div>
    )
  }
  if (!cycle) {
    return <p className='text-red-600'>هذا المقرر غير موجود</p>
  }
  return <EditCycleForm cycle={cycle} curricula={curricula} />
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل دورة</DialogTitle>
        </DialogHeader>
        <Content id={id!} />
      </DialogContent>
    </Dialog>
  )
}
