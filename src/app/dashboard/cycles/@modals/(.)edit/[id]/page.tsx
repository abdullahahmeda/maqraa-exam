'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditCycleForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'

export default function EditCycleModal() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { data: cycle } = api.cycle.getOneForEdit.useQuery({
    id: params.id,
  })
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
          <DialogTitle>تعديل دورة</DialogTitle>
        </DialogHeader>
        {!!cycle && !!curricula ? (
          <EditCycleForm cycle={cycle} curricula={curricula.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
