'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { NewCycleForm } from '../../_components/new-form'
import { useRouter } from 'next/navigation'

export default function NewCycleModal() {
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
          <DialogTitle>إضافة دورة</DialogTitle>
        </DialogHeader>
        <NewCycleForm />
      </DialogContent>
    </Dialog>
  )
}
