import { EditIcon, EyeIcon, InfoIcon, TrashIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { Button } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

type Action = 'info' | 'view' | 'edit' | 'delete'

type ButtonProps = {
  handle?: () => unknown
  icon: ReactNode
  tooltip: string
  order: number
} & Omit<ComponentPropsWithoutRef<'button'>, 'onClick'>

type Props = Record<Action, ButtonProps> & {
  className?: string
}

const buttonsDefaluts: Record<Action, ButtonProps> = {
  info: {
    icon: <InfoIcon className='h-4 w-4 text-cyan-500' />,
    tooltip: 'نبذة',
    className: 'hover:bg-cyan-50',
    order: 1,
  },
  view: {
    icon: <EyeIcon className='h-4 w-4 text-blue-500' />,
    tooltip: 'عرض',
    className: 'hover:bg-blue-50',
    order: 2,
  },
  edit: {
    icon: <EditIcon className='h-4 w-4 text-orange-500' />,
    tooltip: 'تعديل',
    className: 'hover:bg-orange-50',
    order: 3,
  },
  delete: {
    icon: <TrashIcon className='h-4 w-4 text-red-600' />,
    tooltip: 'حذف',
    className: 'hover:bg-red-50',
    order: 4,
  },
}

function renderButton(
  action: Action,
  {
    icon = buttonsDefaluts[action].icon,
    tooltip = buttonsDefaluts[action].tooltip,
    handle,
    className,
    ...props
  }: Partial<ButtonProps>
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn('hover:bg-blue-50', className)}
          onClick={handle}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const RowActions = (props: Partial<Props>) => {
  const { className, ...buttons } = props
  const buttonEntries = Object.entries(buttons).sort(
    ([aAction, a], [bAction, b]) => {
      const aOrder = a.order ?? buttonsDefaluts[aAction as Action].order
      const bOrder = b.order ?? buttonsDefaluts[bAction as Action].order
      return aOrder - bOrder
    }
  )
  return buttonEntries.length > 0 ? (
    <div className={cn('flex justify-center gap-2', className)}>
      <TooltipProvider>
        {buttonEntries.map(([action, props]) =>
          renderButton(action as Action, props)
        )}
      </TooltipProvider>
    </div>
  ) : null
}
