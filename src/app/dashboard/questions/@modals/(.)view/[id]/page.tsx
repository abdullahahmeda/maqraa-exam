'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useParams, useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { ViewOne } from '../../../_components/view-one'
import { Spinner } from '~/components/ui/spinner'

export default function ViewQuestionModal() {
  const params = useParams()
  const router = useRouter()

  const { data: question } = api.question.get.useQuery({
    id: params?.id as string,
    include: { course: true, style: true },
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
          <DialogTitle>عرض سؤال</DialogTitle>
        </DialogHeader>
        {question ? (
          <ViewOne question={question} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
