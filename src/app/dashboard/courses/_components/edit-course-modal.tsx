'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditCourseForm } from './edit-form'
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'

function Content({ id }: { id: string }) {
  const {
    data: course,
    isPending,
    isError,
  } = api.course.getEdit.useQuery({ id }, { enabled: id != undefined })

  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء تحميل البيانات</p>
  }
  if (isPending) {
    return (
      <div className='flex justify-center'>
        <Spinner className='h-4 w-4' />
      </div>
    )
  }
  if (!course) {
    return <p className='text-red-600'>هذا المقرر غير موجود</p>
  }
  return <EditCourseForm course={course} />
}

export function EditCourseModal({
  id,
  setOpen,
}: {
  id: string | undefined
  setOpen: () => void
}) {
  return (
    <Dialog open={id != undefined} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل مقرر</DialogTitle>
        </DialogHeader>
        {id != undefined && <Content id={id} />}
      </DialogContent>
    </Dialog>
  )
}
