import { FilterIcon } from 'lucide-react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { type ReactNode } from 'react'
import { type Column } from '@tanstack/react-table'

type FilterHeaderProps<TData> = {
  label: string
  filter: ReactNode
  column: Column<TData>
}

export const FilterHeader = <TData,>({
  label,
  filter,
  column,
}: FilterHeaderProps<TData>) => {
  const isFilterApplied = column.getIsFiltered()

  return (
    <div className='flex items-center'>
      <span>{label}</span>
      <Popover>
        <PopoverTrigger className='mr-auto' asChild>
          <Button variant={isFilterApplied ? 'secondary' : 'ghost'} size='icon'>
            <FilterIcon className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent>{filter}</PopoverContent>
      </Popover>
    </div>
  )
}
