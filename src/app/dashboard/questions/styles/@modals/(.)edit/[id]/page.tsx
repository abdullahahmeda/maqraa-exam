'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditQuestionStyleForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'
import { type ChoiceColumn } from '../../../_components/form-fields'

export default function EditQuestionStyleModal() {
  const router = useRouter()
  const params = useParams()
  const { data: questionStyle } = api.questionStyle.get.useQuery({
    id: params?.id as string,
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
          <DialogTitle>تعديل نوع سؤال</DialogTitle>
        </DialogHeader>
        {questionStyle ? (
          <EditQuestionStyleForm
            questionStyle={
              questionStyle.type === 'WRITTEN'
                ? {
                    id: questionStyle.id,
                    name: questionStyle.name,
                    type: questionStyle.type,
                  }
                : {
                    id: questionStyle.id,
                    name: questionStyle.name,
                    type: questionStyle.type,
                    choicesColumns:
                      questionStyle.choicesColumns as ChoiceColumn[],
                  }
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
