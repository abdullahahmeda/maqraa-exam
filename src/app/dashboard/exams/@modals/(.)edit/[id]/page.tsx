'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditExamForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'

export default function EditExamModal() {
  const router = useRouter()
  const params = useParams()

  const { data: exam } = api.exam.get.useQuery({ id: params?.id as string })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل إختبار</DialogTitle>
        </DialogHeader>
        {exam ? (
          <EditExamForm exam={exam} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
