import {
  Table as TanstackTable,
  flexRender,
  Updater,
} from '@tanstack/react-table'

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
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2Icon,
} from 'lucide-react'
import { Input } from './input'
import { cn } from '~/lib/utils'

interface DataTableProps<T> {
  table: TanstackTable<T>
  fetching?: boolean
}

const Pagination = ({
  defaultPageIndex,
  pageCount,
  setPageIndex,
}: {
  defaultPageIndex: number
  pageCount: number
  setPageIndex: (update: Updater<number>) => void
}) => {
  const canPreviousPage = defaultPageIndex > 0
  const canNextPage = defaultPageIndex < pageCount - 1

  // TODO: sometiems less than 5 elements are shown. For example (pageIndex === 0)
  const previousPagesLength = Math.min(2, defaultPageIndex)
  const previousPages = Array.from(
    { length: previousPagesLength },
    (_, i) => defaultPageIndex - (previousPagesLength - i)
  )
  const nextPagesLength = Math.min(2, pageCount - 1 - defaultPageIndex)
  const nextPages = Array.from(
    { length: nextPagesLength },
    (_, i) => defaultPageIndex + 1 + i
  )

  return (
    <div className='flex items-center justify-end space-x-2 space-x-reverse py-4'>
      <div className='flex items-center gap-2'>
        <p>الصفحة</p>
        <Input
          type='number'
          min={1}
          max={pageCount - 1}
          value={defaultPageIndex + 1}
          onChange={(e) => {
            const value = e.target.value
            setPageIndex(Number(value))
          }}
        />
        <p className='flex-shrink-0'>
          من <strong>{pageCount}</strong>
        </p>
      </div>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPageIndex(() => 0)}
        disabled={defaultPageIndex === 0}
        title='الصفحة الأولى'
      >
        <ChevronsRightIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPageIndex(() => defaultPageIndex - 1)}
        disabled={!canPreviousPage}
        title='الصفحة السابقة'
      >
        <ChevronRightIcon className='h-4 w-4' />
      </Button>
      {previousPages.map((p) => (
        <Button
          key={p}
          variant='outline'
          size='icon'
          onClick={() => setPageIndex(() => p)}
        >
          {p + 1}
        </Button>
      ))}
      <Button variant='ghost' size='icon'>
        {defaultPageIndex + 1}
      </Button>
      {nextPages.map((p) => (
        <Button
          key={p}
          variant='outline'
          size='icon'
          onClick={() => setPageIndex(() => p)}
        >
          {p + 1}
        </Button>
      ))}
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPageIndex(() => defaultPageIndex + 1)}
        disabled={!canNextPage}
        title='الصفحة التالية'
      >
        <ChevronLeftIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setPageIndex(() => pageCount - 1)}
        disabled={defaultPageIndex >= pageCount - 1}
        title='الصفحة الأخيرة'
      >
        <ChevronsLeftIcon className='h-4 w-4' />
      </Button>
    </div>
  )
}

export function DataTable<T>({ table, fetching = false }: DataTableProps<T>) {
  return (
    <div>
      <Pagination
        defaultPageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        setPageIndex={table.setPageIndex}
      />
      <div className='rounded-md border bg-white shadow'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'bg-muted px-4 py-2',
                        {
                          'text-right': meta?.textAlign === 'right',
                          'text-left': meta?.textAlign === 'left',
                          'text-center': meta?.textAlign === 'center',
                        },
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
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
                    <Loader2Icon className='animate-spin' />
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
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'px-4 py-1',
                          {
                            'text-right': meta?.textAlign === 'right',
                            'text-left': meta?.textAlign === 'left',
                            'text-center': meta?.textAlign === 'center',
                          },
                          meta?.tdClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
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
      <Pagination
        defaultPageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        setPageIndex={table.setPageIndex}
      />
    </div>
  )
}
