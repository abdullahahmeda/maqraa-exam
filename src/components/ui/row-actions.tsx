import { EditIcon, EyeIcon, InfoIcon, TrashIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Button, ButtonProps } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

type ButtonKey = 'infoButton' | 'viewButton' | 'editButton' | 'deleteButton'

type RowActionButtonProps = {
  icon: ReactNode
  tooltip: string
  order: number
} & ButtonProps

type Props = Partial<Record<ButtonKey, Partial<RowActionButtonProps>>> & {
  className?: string
  customButtons?: RowActionButtonProps[]
}

const buttonsDefaultProps: RowActionButtonProps[] = [
  {
    icon: <InfoIcon className='h-4 w-4 text-cyan-500' />,
    tooltip: 'نبذة',
    className: 'hover:bg-cyan-100',
    order: 1,
  },
  {
    icon: <EyeIcon className='h-4 w-4 text-blue-500' />,
    tooltip: 'عرض',
    className: 'hover:bg-blue-100',
    order: 2,
  },
  {
    icon: <EditIcon className='h-4 w-4 text-orange-500' />,
    tooltip: 'تعديل',
    className: 'hover:bg-orange-100',
    order: 3,
  },
  {
    icon: <TrashIcon className='h-4 w-4 text-red-600' />,
    tooltip: 'حذف',
    className: 'hover:bg-red-100',
    order: 4,
  },
]

const RowActionButton = ({
  icon,
  tooltip,
  order: _,
  ...props
}: RowActionButtonProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' {...props}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const RowActions = ({
  infoButton,
  viewButton,
  editButton,
  deleteButton,
  customButtons = [],
}: Props) => {
  const orderedButtons = [infoButton, viewButton, editButton, deleteButton]
    .map((buttonProps, index) => {
      if (buttonProps !== undefined) {
        const defaultProps = buttonsDefaultProps[index]!
        return { ...defaultProps, ...buttonProps }
      }
      return undefined
    })
    .concat(customButtons)
    .sort((a, b) => {
      if (a === undefined) return 1
      if (b === undefined) return -1
      return a.order - b.order
    })
    .filter((button) => button !== undefined) as RowActionButtonProps[]

  return orderedButtons.length > 0 ? (
    <div className='flex gap-1'>
      {orderedButtons.map((buttonProps, index) => (
        <RowActionButton key={index} {...buttonProps} />
      ))}
    </div>
  ) : null
}
