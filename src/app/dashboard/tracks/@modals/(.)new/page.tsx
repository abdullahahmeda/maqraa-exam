'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewTrackForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'

export default function NewTrackModal() {
  const router = useRouter()
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
          <DialogTitle>إضافة مقرر</DialogTitle>
        </DialogHeader>
        {courses ? (
          <NewTrackForm courses={courses.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
