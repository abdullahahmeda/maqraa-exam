import fuzzysort from 'fuzzysort'
import * as React from 'react'
import { X } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '~/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

type Props<T> = {
  labelKey: keyof T
  valueKey: keyof T
  value: string[]
  placeholder?: string
  onSelect: (newValue: any) => void
  items: T[]
}

export const MultiSelect = <T extends Record<string, string>>({
  value,
  onSelect,
  items,
  labelKey,
  valueKey,
  placeholder,
}: Props<T>) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = (valueToDelete: string) => {
    onSelect(value.filter((s) => s !== valueToDelete))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          const newValue = [...value]
          newValue.pop()
          onSelect(newValue)
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur()
      }
    }
  }

  const selectables = inputValue
    ? // @ts-ignore
      fuzzysort
        .go(
          inputValue,
          items.filter((item) => !value.includes(item[valueKey] as string)),
          { key: labelKey }
        )
        // @ts-ignore
        .map((item) => item.obj)
    : items.filter((item) => !value.includes(item[valueKey] as string))
  const selected = items.filter((item) =>
    value.includes(item[valueKey] as string)
  )

  return (
    <Command
      onKeyDown={handleKeyDown}
      className='overflow-visible bg-transparent'
      shouldFilter={false}
    >
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {selected.map((item) => {
            return (
              <Badge key={item[valueKey]} variant='secondary'>
                {item[labelKey]}
                <button
                  className='mr-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  type='button'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item[valueKey] as string)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(item[valueKey] as string)}
                >
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
          />
        </div>
      </div>
      <div className='relative mt-2'>
        {open && selectables.length > 0 ? (
          <div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
            <CommandGroup className='h-full overflow-auto'>
              {selectables.map((item) => {
                return (
                  <CommandItem
                    key={item[valueKey]}
                    value={item[valueKey]}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={(newValue) => {
                      setInputValue('')
                      // onSelect((prev) => [...prev, value])
                      onSelect(value.concat(newValue))
                    }}
                    className={'cursor-pointer'}
                  >
                    {item[labelKey]}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
