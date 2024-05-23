'use client'

import { useState, type ReactNode } from 'react'
import { Navbar } from './navbar'
import { MenuLink, Sidebar } from './sidebar'
import { Content } from './content'

export default function ClientLayout({
  children,
  menu,
  notifications,
}: {
  children: ReactNode
  menu: MenuLink[]
  notifications: {
    id: string
    body: string
    url: string | null
    createdAt: Date
    isRead: boolean
  }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((isOpen) => !isOpen)
  return (
    <>
      <Navbar isOpen={isOpen} toggle={toggle} notifications={notifications} />
      <div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} menu={menu} />
        <Content isOpen={isOpen}>{children}</Content>
      </div>
    </>
  )
}
