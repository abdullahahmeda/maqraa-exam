'use client'
import { EditIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/trpc/react'
import { EditCurriculumForm } from '../../curricula/_components/edit-form'

export function EditCurriculumButton({ id }: { id: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: curriculum, isLoading: isCurriculumLoading } = api.curriculum.getEdit.useQuery({ id }, { enabled: modalOpen })
  const { data: tracks, isLoading: isTracksLoading } = api.track.list.useQuery({
    include: { course: true },
  })
  const isLoading = isCurriculumLoading || isTracksLoading
  return (
    <>
      <Button size='icon' onClick={() => setModalOpen(true)}>
        <EditIcon className='h-4 w-4' />
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المنهج</DialogTitle>
          </DialogHeader>
          {!isLoading ? (
            <EditCurriculumForm curriculum={curriculum!} tracks={tracks!.data} />
          ) : (
            <div className='flex justify-center'>
              <Spinner className='h-4 w-4' />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
