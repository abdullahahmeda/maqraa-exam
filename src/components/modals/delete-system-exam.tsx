import { toast } from 'sonner'
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
  const mutation = api.systemExam.delete.useMutation()
  const utils = api.useUtils()

  const deleteSystemExam = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.systemExam.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف الإمتحان...',
      success: 'تم حذف الإمتحان بنجاح',
      error: (error) => error.message,
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
