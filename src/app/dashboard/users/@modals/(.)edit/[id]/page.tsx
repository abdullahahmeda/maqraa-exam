'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EditUserForm } from '../../../_components/edit-form'
import { api } from '~/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '~/components/ui/spinner'
import { useSession } from 'next-auth/react'

export default function EditCurriculumModal() {
  const router = useRouter()
  const params = useParams()
  const { data: user } = api.user.get.useQuery({
    id: params?.id as string,
    include: {
      cycles: { curriculum: { track: { course: true } }, cycle: true },
    },
  })
  const { data: cycles } = api.cycle.getList.useQuery()
  const { data: session } = useSession()

  const doesNotHavePermissions =
    session?.user?.role === 'ADMIN' && user?.role === 'SUPER_ADMIN'

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل مستخدم</DialogTitle>
        </DialogHeader>

        {user && cycles ? (
          <>
            {doesNotHavePermissions ? (
              <p>لا تملك الصلاحيات الكافية لذلك</p>
            ) : (
              <EditUserForm user={user} cycles={cycles} />
            )}
          </>
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-4 w-4' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
