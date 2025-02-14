'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditCurriculumForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'

export default function EditCurriculumModal() {
  const router = useRouter()
  const params = useParams()
  const { data: curriculum } = api.curriculum.getEdit.useQuery({
    id: params?.id as string,
    include: { parts: true },
  })
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
          <DialogTitle>تعديل منهج</DialogTitle>
        </DialogHeader>
        {curriculum && tracks ? (
          <EditCurriculumForm curriculum={curriculum} tracks={tracks.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
