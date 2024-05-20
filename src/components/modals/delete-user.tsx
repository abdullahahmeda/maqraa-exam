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

export const DeleteUserDialog = ({ id }: { id: string }) => {
  const mutation = api.user.delete.useMutation()
  const utils = api.useUtils()

  const deleteUser = () => {
    const promise = mutation.mutateAsync(id).finally(() => {
      utils.user.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري حذف المستخدم...',
      success: 'تم حذف المستخدم بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>هل تريد حقاً حذف هذا المستخدم؟</AlertDialogTitle>
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
