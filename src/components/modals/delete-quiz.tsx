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

export const DeleteQuizDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const quizDelete = api.quiz.delete.useMutation()
  const queryClient = useQueryClient()

  const deletequiz = () => {
    const t = toast({ title: 'جاري حذف الإمتحان' })
    quizDelete
      .mutateAsync({ where: { id } })
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف الإمتحان بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['quiz']])
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
        <AlertDialogAction onClick={deletequiz}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
