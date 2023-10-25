import { Table as TanstackTable, flexRender } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from './button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react'
import Pagination from '../pagination'

interface DataTableProps<T> {
  table: TanstackTable<T>
  fetching?: boolean
}

export function DataTable<T>({ table, fetching = false }: DataTableProps<T>) {
  return (
    <div>
      <div className='rounded-md border bg-white shadow'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='p-4'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='h-24 text-center'
                >
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='animate-spin' />
                    جاري تحميل البيانات
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='p-4'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='h-24 text-center'
                >
                  لا يوجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 space-x-reverse py-4'>
        <p>
          الصفحة <strong>{table.getState().pagination.pageIndex + 1}</strong> من{' '}
          <strong>{table.getPageCount()}</strong>
        </p>
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.setPageIndex(() => 0)}
          disabled={table.getState().pagination.pageIndex === 0}
          title='الصفحة الأولى'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title='الصفحة السابقة'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title='الصفحة التالية'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => table.setPageIndex(() => table.getPageCount() - 1)}
          disabled={
            table.getState().pagination.pageIndex === table.getPageCount() - 1
          }
          title='الصفحة الأخيرة'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
