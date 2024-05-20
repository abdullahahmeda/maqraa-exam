'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewQuestionStyleForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'

export default function NewQuestionStyleModal() {
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
          <DialogTitle>إضافة نوع سؤال</DialogTitle>
        </DialogHeader>
        <NewQuestionStyleForm />
      </DialogContent>
    </Dialog>
  )
}
