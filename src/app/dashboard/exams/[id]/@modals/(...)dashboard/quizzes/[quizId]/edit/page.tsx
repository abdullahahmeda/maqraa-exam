'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'

const EditQuizModal = () => {
  const router = useRouter()
  const params = useParams()

  const { data: quiz } = api.quiz.get.useQuery({ id: params.quizId as string })

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
        {!!quiz ? (
          // <NewExamForm cycles={cycles.data} courses={courses.data} />
          <p>HI kofta</p>
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditQuizModal
