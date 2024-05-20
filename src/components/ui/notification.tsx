'use client'

import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { api } from '~/trpc/react'
import { cn } from '~/lib/utils'
import { useRouter } from 'next/navigation'
import { LinkIcon } from 'lucide-react'

export const Notification = ({
  notification,
}: {
  notification: {
    id: string
    body: string
    url: string | null
    createdAt: Date
    isRead: boolean
  }
}) => {
  const router = useRouter()
  const utils = api.useUtils()

  const mutation = api.notification.markAsRead.useMutation({
    onSuccess: () => {
      void utils.notification.invalidate()
    },
    onSettled: () => {
      if (notification.url) router.push(notification.url)
    },
  })

  const markNotificationAsRead = () => {
    if (notification.isRead) return
    mutation.mutate({ id: notification.id })
  }

  const children = (
    <div
      className={cn(
        'px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors',
        notification.isRead && 'bg-accent text-accent-foreground',
      )}
    >
      <p className='text-xs font-light text-left'>
        منذ {formatDistanceToNow(notification.createdAt, { locale: ar })}
      </p>
      <div
        className={cn(
          'flex text-sm items-center font-medium gap-4',
          notification.isRead && 'font-normal',
        )}
      >
        {notification.url && <LinkIcon className='h-4 w-4 flex-shrink-0' />}
        <p className='text-right'>{notification.body}</p>
      </div>
    </div>
  )

  return (
    <button className='block w-full' onClick={markNotificationAsRead}>
      {children}
    </button>
  )
}
