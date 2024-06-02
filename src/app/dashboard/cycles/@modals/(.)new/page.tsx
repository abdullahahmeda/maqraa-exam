'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewCycleForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { Spinner } from '~/components/ui/spinner'

export default function NewCycleModal() {
  const router = useRouter()

  const { data: curricula } = api.curriculum.list.useQuery()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة دورة</DialogTitle>
        </DialogHeader>
        {!!curricula ? (
          <NewCycleForm curricula={curricula.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
