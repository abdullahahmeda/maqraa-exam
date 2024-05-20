'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditTrackForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'

export default function EditTrackModal() {
  const router = useRouter()
  const params = useParams()
  const { data: track } = api.track.get.useQuery({ id: params?.id as string })
  const { data: courses } = api.course.list.useQuery()
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل مسار</DialogTitle>
        </DialogHeader>
        {track && courses ? (
          <EditTrackForm track={track} courses={courses.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
