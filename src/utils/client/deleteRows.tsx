import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

export function deleteRows({
  mutateAsync,
  invalidate,
  setRowSelection,
}: {
  mutateAsync: () => Promise<unknown>
  invalidate: () => Promise<unknown>
  setRowSelection?: Dispatch<SetStateAction<{}>>
}) {
  const promise = mutateAsync()
    .then(() => {
      if (setRowSelection) setRowSelection({})
    })
    .finally(() => {
      invalidate()
    })

  toast.promise(promise, {
    loading: `جاري الحذف...`,
    success: 'تم الحذف بنجاح',
    error: 'حدث خطأ أثناء الحذف',
  })
}
