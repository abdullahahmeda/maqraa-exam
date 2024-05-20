export default function Layout({
  children,
  modals,
  utilityModals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
  utilityModals: React.ReactNode
}) {
  return (
    <>
      {children}
      {modals}
      {utilityModals}
    </>
  )
}
