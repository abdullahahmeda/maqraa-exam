import { createContext, ReactNode, useContext, useState } from 'react'

type Context = {
  isSidebarOpen: boolean
  closeSidebar: () => void
  openSidebar: () => void
  toggleSidebar: () => void
}

const defaultContextValue = {
  isSidebarOpen: false,
  closeSidebar: () => {},
  openSidebar: () => {},
  toggleSidebar: () => {}
}

const ThemeContext = createContext<Context>(defaultContextValue)

export const Provider = ({
  children,
  value = defaultContextValue
}: {
  children: ReactNode
  value?: Context
}) => {
  const [theme, setTheme] = useState(value)
  const closeSidebar = () =>
    setTheme(theme => ({ ...theme, isSidebarOpen: false }))
  const openSidebar = () =>
    setTheme(theme => ({ ...theme, isSidebarOpen: true }))
  const toggleSidebar = () =>
    setTheme(theme => ({ ...theme, isSidebarOpen: !theme.isSidebarOpen }))

  const contextValue = {
    isSidebarOpen: theme.isSidebarOpen,
    closeSidebar,
    openSidebar,
    toggleSidebar
  }
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
