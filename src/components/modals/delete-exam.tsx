import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
import { api } from "~/utils/api"
import { AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "../ui/alert-dialog"

export const DeleteExamDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const examDelete = api.exams.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteExam = () => {
    const t = toast({ title: 'جاري حذف الإمتحان' })
    examDelete
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
        queryClient.invalidateQueries([['exams']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا الإمتحان</AlertDialogTitle>
        <AlertDialogDescription>
          هذا سيحذف المناهج والإختبارات المرتبطة به أيضاً
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteExam}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
