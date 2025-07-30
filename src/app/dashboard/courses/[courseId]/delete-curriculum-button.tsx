'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { TrashIcon } from 'lucide-react'
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
import { toast } from 'sonner'
import { api } from '~/utils/api'
import { type TRPCError } from '@trpc/server'
import { Spinner } from '~/components/ui/spinner'

export function DeleteCurriculumButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const utils = api.useUtils()
  const mutation = api.curriculum.delete.useMutation()

  const deleteCurriculum = (id: string) => {
    const promise = mutation.mutateAsync(id)

    toast.promise(promise, {
      loading: 'جاري حذف المنهج...',
      success: 'تم حذف المنهج بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف المنهج',
    })

    void promise.finally(() => {
      void utils.curriculum.invalidate()
      void utils.course.getOneForShow.invalidate()
    })
  }
  return (
    <>
    <Button variant='destructive' size='icon' onClick={() => setOpen(true)}>
      <TrashIcon className='h-4 w-4' />
    </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا المنهج وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCurriculum(id)}>
              {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
