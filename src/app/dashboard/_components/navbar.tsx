'use client'

import { BellIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Notification } from '~/components/ui/notification'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { api } from '~/trpc/react'
import { SidebarTrigger } from '~/components/ui/sidebar'

export function Navbar({
  notifications: initialNotifications,
}: {
  notifications: {
    id: string
    body: string
    url: string | null
    createdAt: Date
    isRead: boolean
  }[]
}) {
  const utils = api.useUtils()
  const { data: notifications } = api.notification.fetch.useQuery(undefined, {
    initialData: initialNotifications,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 mins
    refetchIntervalInBackground: true,
  })

  const markAllNotificationsAsRead = api.notification.markAllAsRead.useMutation(
    {
      onSuccess: () => {
        void utils.notification.invalidate()
      },
    },
  )

  const notificationsNotRead = notifications.filter((n) => !n.isRead)

  return (
    <nav className='h-16 border-b'>
      <div className='px-3 flex h-full items-center justify-between'>
        <div className='flex items-center'>
        <SidebarTrigger className='ml-4' />
          <h1 className='text-lg font-bold'>لوحة التحكم</h1>
        </div>
        <div className='flex items-center mr-auto gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button size='icon' variant='outline' className='relative'>
                <BellIcon className='h-4 w-4' />
                {notificationsNotRead.length > 0 && (
                  <div className='absolute text-xs leading-5 -top-1 -left-1 h-5 w-5 rounded-full bg-red-500'>
                    {notificationsNotRead.length < 10
                      ? notificationsNotRead.length
                      : '9+'}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='px-0 min-w-80'>
              <h3 className='font-semibold text-lg mr-2'>
                الإشعارات غير المقروؤة ({notificationsNotRead.length})
              </h3>
              <Separator className='mt-1 text-black' />
              {initialNotifications.length === 0 ? (
                <p className='text-muted'>لا يوجد إشعارات</p>
              ) : (
                <div className='divide-y max-h-60 overflow-y-scroll'>
                  {notifications.map((notification) => (
                    <Notification
                      notification={notification}
                      key={notification.id}
                    />
                  ))}
                </div>
              )}

              <Button
                variant='link'
                className='p-0 h-auto mr-2 mt-4'
                onClick={() => {
                  markAllNotificationsAsRead.mutate()
                }}
              >
                تحديد الكل كمقروؤة
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  )
}
