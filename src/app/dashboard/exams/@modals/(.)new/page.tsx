'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewExamForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { Spinner } from '~/components/ui/spinner'

export default function NewExamModal() {
  const router = useRouter()

  const { data: cycles } = api.cycle.getList.useQuery()
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
          <DialogTitle>إضافة إختبار</DialogTitle>
        </DialogHeader>
        {!!cycles && !!courses ? (
          <NewExamForm cycles={cycles} courses={courses.data} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
