import { type ReactNode, createContext, useContext, useState } from 'react'

type Context = {
  isOpen: boolean
  setIsOpen: (state: boolean) => unknown
  toggle: () => unknown
}

export const SidebarContext = createContext<Context>({
  isOpen: false,
  setIsOpen: () => null,
  toggle: () => null,
})

export const useSidebar = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((isOpen) => !isOpen)

  const value = { isOpen, setIsOpen, toggle }

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
