import { ChevronLeftIcon, type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '~/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '~/components/ui/collapsible'
import { DashboardSidebarFooter } from './sidebar-footer'

export type BaseMenuItem = {
  icon: LucideIcon | null
  label: ReactNode
  key: string
}

export type NestedMenuItem = BaseMenuItem & {
  items: { key: string; label: ReactNode }[]
}

export type MenuItem = BaseMenuItem | NestedMenuItem

interface DashboardSidebarProps {
  menuItems: MenuItem[]
  user: { name?: string | null | undefined }
}

function BaseMenuItem({ item }: { item: BaseMenuItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={item.key}>
          {item.icon ? <item.icon className='ml-2 inline-block' /> : null}
          {item.label}
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NestedMenuItem({ item }: { item: NestedMenuItem }) {
  return (
    <Collapsible asChild className='group/collapsible'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.label as string}>
            {item.icon && <item.icon />}
            <span>{item.label}</span>
            <ChevronLeftIcon className='mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.label as string}>
                <SidebarMenuSubButton asChild>
                  <a href={subItem.key}>
                    <span>{subItem.label}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function MenuItem({ item }: { item: MenuItem }) {
  if ((item as NestedMenuItem).items) return <NestedMenuItem item={item as NestedMenuItem} />
  return <BaseMenuItem item={item} />
}

export function DashboardSidebar({ menuItems, user }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DashboardSidebarFooter user={user} />
    </Sidebar>
  )
}
