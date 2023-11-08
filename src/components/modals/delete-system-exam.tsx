import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { api } from '~/utils/api'
import {
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../ui/alert-dialog'

export const DeleteSystemExamDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const systemExamDelete = api.systemExam.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteSystemExam = () => {
    const t = toast({ title: 'جاري حذف الإمتحان' })
    systemExamDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الإمتحان بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['systemExam']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا الإمتحان؟</AlertDialogTitle>
        <AlertDialogDescription>
          هذا سيحذف الإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteSystemExam}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
