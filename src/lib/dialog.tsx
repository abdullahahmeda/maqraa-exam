import { createContext, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '~/components/ui/dialog'

const DialogContext = createContext(null)

type DialogProps = {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

type State = {
  dialogs: Record<string, DialogProps & { id: string }>
}

const memoryState: State = {
  dialogs: {},
}

function genId() {
  return (Math.random() + 1).toString(36)
}

export function showDialog(props: DialogProps) {
  const id = genId()
  memoryState.dialogs[id] = { ...props, id }
  return id
}

export function closeDialog(dialogId: string) {
  delete memoryState.dialogs[dialogId]
}

export function closeAllDialogs() {
  for (const id of Object.keys(memoryState.dialogs)) {
    closeDialog(id)
  }
}

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const dialogs = Object.values(memoryState.dialogs)

  return (
    <DialogContext.Provider value={null}>
      {children}
      {dialogs.map(({ id, title, description, children }) => (
        <Dialog open key={id}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      ))}
    </DialogContext.Provider>
  )
}
