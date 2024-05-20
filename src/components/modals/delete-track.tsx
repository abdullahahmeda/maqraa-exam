import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

export const DeleteTrackDialog = ({ id }: { id: string }) => {
  const mutation = api.track.delete.useMutation()
  const utils = api.useUtils()

  const deleteTrack = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.track.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف المسار...',
      success: 'تم حذف المسار بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المسار؟</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteTrack}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
