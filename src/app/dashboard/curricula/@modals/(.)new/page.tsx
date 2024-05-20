'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewCurriculumForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'

export default function NewCurriculumModal() {
  const router = useRouter()
  const { data: tracks } = api.track.list.useQuery({
    include: { course: true },
  })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة منهج</DialogTitle>
        </DialogHeader>
        {!!tracks ? (
          <NewCurriculumForm tracks={tracks.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
