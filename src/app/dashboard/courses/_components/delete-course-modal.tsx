'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/utils/api'
import { Spinner } from '~/components/ui/spinner'
import { toast } from 'sonner'
import { type TRPCError } from '@trpc/server'

export function DeleteCourseModal({ id, setOpen }: { id: string | undefined; setOpen: () => void }) {
  const utils = api.useUtils()

  const mutation = api.course.delete.useMutation()

  const deleteCourse = () => {
    const promise = mutation.mutateAsync(id!)

    toast.promise(promise, {
      loading: 'جاري حذف المقرر...',
      success: 'تم حذف المقرر بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف المقرر',
    })
    void promise.finally(() => void utils.course.invalidate())
  }
  return (
    <AlertDialog open={id != undefined} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا سيحذف هذا المقرر وكل ما يتعلق به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={deleteCourse}>
            {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
