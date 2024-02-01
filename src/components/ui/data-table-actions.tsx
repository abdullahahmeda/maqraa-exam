import { TrashIcon, DownloadIcon } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Button } from './button'

type Handler<T = undefined> = T extends undefined
  ? {
      handle: () => unknown
      data?: T
    }
  : {
      handle: () => unknown
      data: T
    }

type BulkDeleteData = { selectedRows: unknown[] }
const BulkDelete = ({ data, handle }: Handler<BulkDeleteData>) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          className='flex items-center gap-2'
          disabled={data.selectedRows.length === 0}
        >
          <TrashIcon size={16} />
          حذف{' '}
          {data.selectedRows.length > 0 &&
            `(${data.selectedRows.length} من العناصر)`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            هل تريد حقاً حذف العناصر المختارة؟
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          سيتم حذف {data.selectedRows?.length} من العناصر
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handle}>تأكيد</AlertDialogAction>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type DeleteAllData = { disabled?: boolean }
const DeleteAll = ({
  handle,
  data = { disabled: false },
}: Handler<DeleteAllData>) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          className='flex items-center gap-2'
          disabled={data.disabled}
        >
          <TrashIcon size={16} />
          حذف الكل
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل تريد حقاً حذف كل العناصر؟</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>سيتم حذف جميع العناصر</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handle}>تأكيد</AlertDialogAction>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type ExcelExportData = { disabled: boolean }
const ExcelExport = ({ handle, data }: Handler<ExcelExportData>) => {
  return (
    <Button
      disabled={data.disabled}
      variant='success'
      className='flex gap-2'
      onClick={handle}
    >
      <DownloadIcon className='h-4 w-4' />
      تصدير الكل
    </Button>
  )
}

export const DataTableActions = ({
  bulkDelete,
  deleteAll,
  excelExport,
  ...props
}: {
  bulkDelete?: Handler<BulkDeleteData>
  deleteAll?: Handler<DeleteAllData>
  excelExport?: Handler<ExcelExportData>
} & ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className='mb-4 gap-2' {...props}>
      <div className='mb-4 flex gap-2'>
        {excelExport && <ExcelExport {...excelExport} />}
        {deleteAll && <DeleteAll {...deleteAll} />}
      </div>
      {bulkDelete && <BulkDelete {...bulkDelete} />}
    </div>
  )
}
