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

export const DeleteQuestionStyleDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const questionDelete = api.questionStyle.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteQuestionStyle = () => {
    const t = toast({ title: 'جاري حذف نوع السؤال...' })
    questionDelete
      .mutateAsync(id)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف نوع السؤال بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['questionStyle']])
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
