'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewCourseForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'

export default function NewCourseModal() {
  const router = useRouter()

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
        <NewCourseForm />
      </DialogContent>
    </Dialog>
  )
}
