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

export const DeleteCycleDialog = ({ id }: { id: string }) => {
  const mutation = api.cycle.delete.useMutation()
  const utils = api.useUtils()

  const deleteCycle = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.cycle.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف الدورة...',
      success: 'تم حذف الدورة بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المقرر؟</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteCycle}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
