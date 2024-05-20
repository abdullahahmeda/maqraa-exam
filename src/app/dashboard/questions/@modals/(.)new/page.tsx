'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { ImportQuestionsForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'

export default function NewCourseModal() {
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
          <DialogTitle>إضافة أسئلة</DialogTitle>
        </DialogHeader>
        <ImportQuestionsForm courses={courses?.data ?? []} />
      </DialogContent>
    </Dialog>
  )
}
