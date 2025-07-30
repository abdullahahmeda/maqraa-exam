'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { NewCourseForm } from '~/app/dashboard/courses/_components/new-form'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function AddCourseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='secondary'>
          <PlusIcon className='h-4 w-4' />
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
