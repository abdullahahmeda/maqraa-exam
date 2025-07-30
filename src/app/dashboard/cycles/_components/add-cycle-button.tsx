'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { NewCycleForm } from './new-form'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'

function Content() {
  const {
    data: curricula,
    isPending,
    isError,
  } = api.curriculum.getList.useQuery()

  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء التحميل</p>
  }

  if (isPending) {
    return (
      <div className='flex justify-center'>
        <Spinner className='h-4 w-4' />
      </div>
    )
  }

  return <NewCycleForm curricula={curricula} />
}

export function AddCycleButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة دورة
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة دورة</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  )
}
