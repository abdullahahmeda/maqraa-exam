import fuzzysort from 'fuzzysort'
import { useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

type Props<T> = {
  labelKey: keyof T
  valueKey: keyof T
  items: T[]
  loading?: boolean
  value: string | undefined
  onSelect: (newValue: any) => void
  triggerText: string
  triggerClassName?: string
  popoverClassName?: string
}

export const Combobox = <T,>({
  loading = false,
  onSelect: _onSelect,
  value,
  items,
  labelKey,
  valueKey,
  triggerText,
  triggerClassName,
  popoverClassName,
}: Props<T>) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const onSelect = (newValue: string | undefined) => {
    _onSelect(newValue)
    setOpen(false)
  }

  const filteredItems = searchValue
    ? // @ts-ignore
      fuzzysort
        .go(searchValue, items, { key: labelKey })
        // @ts-ignore
        .map((item) => item.obj)
    : items

  const triggerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn('justify-between', triggerClassName)}
            disabled={loading}
            ref={triggerRef}
          >
            {value
              ? filteredItems.find((item) => item[valueKey] === value)?.[
                  labelKey
                ]
              : triggerText}
            {loading ? (
              <Loader2 className='mr-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
            ) : (
              <ChevronsUpDown className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-0', popoverClassName)}
          style={{ width: triggerRef.current?.clientWidth }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='ابحث...'
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>لا يوجد بيانات.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    value={item[valueKey]}
                    key={item[valueKey]}
                    onSelect={onSelect}
                  >
                    {item[labelKey]}
                    <Check
                      className={cn(
                        'mr-auto h-4 w-4',
                        value === item[valueKey] ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
