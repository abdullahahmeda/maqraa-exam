import { type ReactNode } from 'react'
import { api } from '~/trpc/server'
import { getServerAuthSession } from '~/server/auth'
// import NextTopLoader from 'nextjs-toploader'
import '~/styles/loader.css'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { DashboardSidebar } from './_components/dashboard-sidebar'
import { menuItems } from './menu-items'
import { Navbar } from './_components/navbar'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // const menu = await api.setting.getMenuItems()
  const session = await getServerAuthSession()
  const notifications = await api.notification.fetch()

  return (
    <SidebarProvider>
      <DashboardSidebar menuItems={menuItems[session!.user.role]} user={session!.user} />
        <div className="flex-grow overflow-x-hidden">
          <Navbar notifications={notifications} />
          <div className='p-4'>{children}</div>
      </div>
      {/* <NextTopLoader
        template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      /> */}
    </SidebarProvider>
  )
}
