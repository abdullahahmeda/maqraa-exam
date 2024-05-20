'use client'

import {
  type ColumnDef,
  type TableOptions,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Table as TableType,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  TableMeta,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './pagination'
import { Spinner } from './spinner'
import { cn } from '~/lib/utils'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'
import { ChevronFirstIcon, ChevronLastIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnFilters?: {
    state: ColumnFiltersState
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  }
  pagination?: {
    state: PaginationState
    pageCount: number
    onPaginationChange: OnChangeFn<PaginationState>
  }
  isFetching?: boolean
  rowSelection?: {
    state: RowSelectionState
    onRowSelectionChange: OnChangeFn<RowSelectionState>
  }
  meta?: TableMeta<TData>
  rowId: keyof TData
}

const DataTablePagination = <TData,>({
  className,
  table,
}: {
  className?: string
  table: TableType<TData>
}) => {
  const currentPageIndex = table.getState().pagination.pageIndex
  const [value, setValue] = useState(currentPageIndex + 1)
  const prevEntries = Array.from({ length: Math.min(2, currentPageIndex) })
    .map((_, i) => currentPageIndex - i - 1)
    .reverse()
  const nextEntries = Array.from({
    length: Math.min(2, table.getPageCount() - 1 - currentPageIndex),
  }).map((_, i) => currentPageIndex + i + 1)

  useEffect(() => {
    setValue(currentPageIndex + 1)
  }, [currentPageIndex])

  const debounced = useCallback(
    debounce((value: number) => {
      if (!isNaN(value)) {
        table.setPageIndex(value)
      } else table.setPageIndex(currentPageIndex)
    }, 500),
    [],
  )

  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <Pagination className={cn('justify-end', className)}>
          <PaginationContent className='bg-white rounded-md p-2 border overflow-x-auto'>
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationItem>
                  <PaginationButton
                    disabled={currentPageIndex === 0}
                    onClick={() => table.firstPage()}
                  >
                    <ChevronLastIcon className='h-4 w-4' />
                  </PaginationButton>
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>الأولى</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  />
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>السابق</p>
              </TooltipContent>
            </Tooltip>
            {prevEntries.map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationButton onClick={() => table.setPageIndex(pageIndex)}>
                  {pageIndex + 1}
                </PaginationButton>
              </PaginationItem>
            ))}
            <PaginationItem>
              <input
                type='number'
                min={1}
                max={table.getPageCount()}
                value={value}
                onChange={(e) => {
                  const value = e.target.valueAsNumber
                  setValue(value)
                  debounced(value - 1)
                }}
                onBlur={(e) => {
                  if (e.target.value === '') setValue(currentPageIndex + 1)
                }}
                className='xhover:bg-accent inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background text-center text-sm font-medium ring-offset-background transition-colors [appearance:textfield] hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              />
            </PaginationItem>
            {nextEntries.map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationButton onClick={() => table.setPageIndex(pageIndex)}>
                  {pageIndex + 1}
                </PaginationButton>
              </PaginationItem>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationItem>
                  <PaginationNext
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  />
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>التالي</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationItem>
                  <PaginationButton
                    disabled={currentPageIndex === table.getPageCount() - 1}
                    onClick={() => table.lastPage()}
                  >
                    <ChevronFirstIcon className='h-4 w-4' />
                  </PaginationButton>
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>الأخيرة</p>
              </TooltipContent>
            </Tooltip>
          </PaginationContent>
        </Pagination>
      </TooltipProvider>
    </div>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnFilters,
  pagination,
  isFetching = false,
  rowSelection,
  meta,
  rowId,
}: DataTableProps<TData, TValue>) {
  let tableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row[rowId] as string,
    meta,
  }

  if (columnFilters)
    tableOptions = {
      ...tableOptions,
      onColumnFiltersChange: columnFilters.onColumnFiltersChange,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        ...tableOptions.state,
        columnFilters: columnFilters.state,
      },
    }

  if (pagination)
    tableOptions = {
      ...tableOptions,
      manualPagination: true,
      pageCount: pagination.pageCount,
      onPaginationChange: pagination.onPaginationChange,
      getPaginationRowModel: getPaginationRowModel(),
      state: {
        ...tableOptions.state,
        pagination: pagination.state,
      },
    }

  if (rowSelection) {
    tableOptions = {
      ...tableOptions,
      onRowSelectionChange: rowSelection.onRowSelectionChange,
      enableRowSelection: true,
      state: {
        ...tableOptions.state,
        rowSelection: rowSelection.state,
      },
    }
  }

  const table = useReactTable(tableOptions)

  return (
    <div>
      {pagination && <DataTablePagination className='mb-2' table={table} />}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={99}>
                  <div className='flex justify-center'>
                    <Spinner className='m-4' />
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  لا يوجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
      {pagination && <DataTablePagination className='mt-2' table={table} />}
    </div>
  )
}
