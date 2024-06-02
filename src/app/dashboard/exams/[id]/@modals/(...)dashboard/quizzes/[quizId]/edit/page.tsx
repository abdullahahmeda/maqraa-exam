'use client'

import { useParams, useRouter } from 'next/navigation'
import { EditQuizForm } from '~/app/dashboard/quizzes/_components/edit-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'
import { enTypeToAr } from '~/utils/exams'

const EditQuizModal = () => {
  const router = useRouter()
  const params = useParams()

  const { data: quiz } = api.quiz.get.useQuery({ id: params.quizId as string })
  const { data: exams } = api.exam.list.useQuery()

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
          <EditQuizForm
            quiz={quiz}
            models={
              exams?.data.map((e) => ({
                name: `${e.name} (${enTypeToAr(e.type)})`,
                id: e.defaultModelId,
              })) ?? []
            }
          />
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
