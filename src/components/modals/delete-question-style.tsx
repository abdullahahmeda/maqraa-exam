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

export const DeleteQuestionStyleDialog = ({ id }: { id: string }) => {
  const mutation = api.questionStyle.delete.useMutation()
  const utils = api.useUtils()

  const deleteQuestionStyle = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.questionStyle.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف نوع السؤال...',
      success: 'تم حذف نوع السؤال بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف نوع السؤال هذا؟</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف الأسئلة المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteQuestionStyle}>
          تأكيد
        </AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
