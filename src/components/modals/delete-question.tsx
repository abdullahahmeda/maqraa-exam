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

export const DeleteQuestionDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const questionDelete = api.questions.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteQuestion = () => {
    const t = toast({ title: 'جاري حذف السؤال...' })
    questionDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف السؤال بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['questions']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا السؤال</AlertDialogTitle>
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
