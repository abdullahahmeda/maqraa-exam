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

export const DeleteUserDialog = ({ id }: { id: string }) => {
  const { toast } = useToast()
  const userDelete = api.user.delete.useMutation()
  const queryClient = useQueryClient()

  const deleteUser = () => {
    const t = toast({ title: 'جاري حذف المستخدم' })
    userDelete
      .mutateAsync({
        where: { id }
      })
      .then(() => {
        t.dismiss()
        toast({ title: 'تم حذف المستخدم بنجاح' })
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['user']])
      })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المستخدم</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        هذا سيحذف الإختبارات المرتبطة به أيضاً
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction onClick={deleteUser}>تأكيد</AlertDialogAction>
        <AlertDialogCancel>إلغاء</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
