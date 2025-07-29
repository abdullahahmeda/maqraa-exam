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
import { NewCurriculumForm } from '../../curricula/_components/new-form'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'

export function AddCurriculumButton({ trackId }: { trackId: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: tracks, isLoading: isTracksLoading } = api.track.list.useQuery({
    include: { course: true },
  })
  const isLoading = isTracksLoading
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size='icon' onClick={() => setModalOpen(true)}>
            <PlusIcon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>إضافة منهج</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة منهج</DialogTitle>
          </DialogHeader>
          {!isLoading ? (
            <NewCurriculumForm tracks={tracks!.data} defaultValues={{ trackId }} />
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
