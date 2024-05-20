import { toast } from 'sonner'
import { api } from '~/trpc/react'
import {
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../ui/alert-dialog'

export const DeleteQuizDialog = ({ id }: { id: string }) => {
  const mutation = api.quiz.delete.useMutation()
  const utils = api.useUtils()

  const deleteQuiz = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.quiz.invalidate()
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
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteQuiz}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
