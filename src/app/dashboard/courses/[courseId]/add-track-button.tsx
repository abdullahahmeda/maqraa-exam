'use client'
import { PlusIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { api } from '~/utils/api'
import { NewTrackForm } from '../../tracks/_components/new-form'

export function AddTrackButton({ courseId }: { courseId: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: courses, isPending: isTracksLoading } = api.course.getList.useQuery()
  const isLoading = isTracksLoading
  return (
    <>
          <Button onClick={() => setModalOpen(true)}>
            <PlusIcon className='ml-2 h-4 w-4' />
            إضافة مسار
          </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة منهج</DialogTitle>
          </DialogHeader>
          {!isLoading ? (
            <NewTrackForm courses={courses!} defaultValues={{ courseId }} />
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
