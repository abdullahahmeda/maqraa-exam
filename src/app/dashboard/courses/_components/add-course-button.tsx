'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { NewCourseForm } from './new-form'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function AddCourseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة مقرر
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مقرر</DialogTitle>
        </DialogHeader>
        <NewCourseForm />
      </DialogContent>
    </Dialog>
  )
}
