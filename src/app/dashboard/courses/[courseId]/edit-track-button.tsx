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
import { EditTrackForm } from '../../tracks/_components/edit-form'

export function EditTrackButton({ id }: { id: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: track, isLoading: isTrackLoading } = api.track.getEdit.useQuery({ id }, { enabled: modalOpen })
  const { data: courses, isLoading: isCoursesLoading } = api.course.getList.useQuery()
  const isLoading = isTrackLoading || isCoursesLoading
  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <EditIcon className='h-4 w-4 ml-2' />
        تعديل
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المسار</DialogTitle>
          </DialogHeader>
          {!isLoading ? (
            <EditTrackForm track={track!} courses={courses} />
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
