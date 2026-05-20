'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { ViewOne } from '../../_components/view-one'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'

export default function EditCurriculumModal() {
  const router = useRouter()
  const params = useParams()
  const { data: user } = api.user.get.useQuery({
    id: params?.id as string,
  })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>بيانات مستخدم</DialogTitle>
        </DialogHeader>
        {user ? (
          <ViewOne user={user} />
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
