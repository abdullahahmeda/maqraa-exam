import { type ReactNode } from 'react'
import { Navbar } from './_components/navbar'
import '~/styles/main-layout.css'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
