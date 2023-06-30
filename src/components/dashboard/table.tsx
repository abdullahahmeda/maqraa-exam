import { flexRender, Table } from '@tanstack/react-table'
import clsx from 'clsx'
import { ReactNode } from 'react'
import Spinner from '../spinner'
import { Button } from '../ui/button'

type Props = {
  table: Table<any>
  refetch?: Function
  isLoading?: boolean
  isLoadingError?: boolean
}

export default function DashboardTable({
  table,
  refetch = () => undefined,
  isLoading = false,
  isLoadingError = false,
}: Props) {
  const renderTableBody = (): ReactNode => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={99}>
            <span className='flex items-center justify-center gap-2 text-center'>
              <Spinner variant='primary' />
              جاري التحميل..
            </span>
          </td>
        </tr>
      )
    }

    if (isLoadingError) {
      return (
        <tr>
          <td colSpan={99}>
            <div className='flex flex-col items-center justify-center gap-2 text-center'>
              <p className='text-red-500'>
                حدث خطأ أثناء تحميل البيانات، يرجى إعادة المحاولة
              </p>
              <Button onClick={() => refetch()}>إعادة المحاولة</Button>
            </div>
          </td>
        </tr>
      )
    }

    if (table.getRowModel().rows.length === 0)
      return (
        <tr>
          <td colSpan={99} className='text-center'>
            لا يوجد بيانات
          </td>
        </tr>
      )
    return table.getRowModel().rows.map((row) => (
      <tr key={row.id} className='border-b'>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className={clsx(
              'px-6 py-4 text-sm',
              cell.column.columnDef.meta?.className
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  }
  return (
    <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-md'>
      <table className='w-full'>
        <thead className='bg-gray-100'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='px-6 py-4'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  )
}
