import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { api } from '~/utils/api'
import { toast } from 'sonner'

export const DeleteQuestionDialog = ({ id }: { id: string }) => {
  const mutation = api.question.delete.useMutation()
  const utils = api.useUtils()

  const deleteQuestion = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.question.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف السؤال...',
      success: 'تم حذف السؤال بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا السؤال؟</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذفه من الإختبارات الموجودة أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteQuestion}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
