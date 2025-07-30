'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'
import { enUserRoleToAr } from '~/utils/users'

type Id = undefined | string

const ModalContext = createContext({
  userId: undefined as Id,
  setUserId: (_id: Id) => { return; }
})

export function useViewModal() {
  return useContext(ModalContext)
}

export function ViewModalProvider({ children }: { children: ReactNode }) {
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

function Content({ id }: { id: string }) {
  const { data: user, isLoading, isError } = api.user.get.useQuery({ id })

  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء التحميل</p>
  }

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <Spinner className='h-4 w-4' />
      </div>
    )
  }

  if (!user) {
    return <p className='text-red-600'>هذا المستخدم غير موجود</p>
  }

  return (
    <div>
      <div className='space-y-2'>
        <div className='flex justify-center'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-center font-bold text-lg'>{user.name}</p>
          <Badge>{enUserRoleToAr(user.role)}</Badge>
        </div>
      </div>
      <Separator className='my-4' />
      <p>البريد الإلكتروني: {user.email}</p>
      {!!user.phone && <p>رقم الهاتف: {user.phone}</p>}
    </div>
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>بيانات مستخدم</DialogTitle>
        </DialogHeader>
        {id != undefined && <Content id={id} />}
      </DialogContent>
    </Dialog>
  )
}
