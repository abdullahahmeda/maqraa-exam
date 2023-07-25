import { useQueryClient } from '@tanstack/react-query'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/utils/api'
import { useToast } from '../ui/use-toast'

export const DeleteCycleDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const cycleDelete = api.cycles.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteCycle = () => {
    const t = toast({ title: 'جاري حذف الدورة' })
    cycleDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الدورة بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['cycles']])
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
