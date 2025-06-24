'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewUserForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'

export default function NewUserModal() {
  const router = useRouter()
  const { data: cycles } = api.cycle.getList.useQuery()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مستخدم</DialogTitle>
        </DialogHeader>
        {!!cycles ? (
          <NewUserForm cycles={cycles} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
