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

export function DeleteTrackButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const utils = api.useUtils()

  const mutation = api.track.delete.useMutation()

  const deleteTrack = (id: string) => {
    const promise = mutation.mutateAsync(id)

    toast.promise(promise, {
      loading: 'جاري حذف المسار...',
      success: 'تم حذف المسار بنجاح',
      error: (error: unknown) =>
        (error as TRPCError).message ?? 'تعذر حذف المسار',
    })
    void promise.finally(() => {
      void utils.track.invalidate()
      void utils.course.getOneForShow.invalidate()
    })
  }
  return (
    <>
    <Button variant='destructive' onClick={() => setOpen(true)}>
      <TrashIcon className='h-4 w-4 ml-2' />
      حذف
    </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا سيحذف هذا المسار وكل ما يتعلق به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTrack(id)}>
              {mutation.isPending && <Spinner className='ml-2 h-4 w-4' />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
