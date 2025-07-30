import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

export function deleteRows({
  mutateAsync,
  setRowSelection,
}: {
  mutateAsync: () => Promise<unknown>
  setRowSelection?: Dispatch<SetStateAction<object>>
}) {
  const promise = mutateAsync()
    .then(() => {
      if (setRowSelection) setRowSelection({})
    })

  toast.promise(promise, {
    loading: `جاري الحذف...`,
    success: 'تم الحذف بنجاح',
    error: 'حدث خطأ أثناء الحذف',
  })
}
