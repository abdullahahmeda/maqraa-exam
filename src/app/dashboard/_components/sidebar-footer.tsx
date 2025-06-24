'use client'

import { signOut } from 'next-auth/react'
import { ChevronUpIcon, User2Icon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '~/components/ui/sidebar'

type Props = {
  user: { name?: string | null | undefined }
}

export function DashboardSidebarFooter({ user }: Props) {
  return (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2Icon /> {user.name}
                  <ChevronUpIcon className="mr-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                <a href='/dashboard/profile'>تعديل الحساب</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
  )
}
