'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import type {
  Course,
  Curriculum,
  Cycle,
  Track,
  User,
  UserCycle,
} from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import {
  type EditUserFieldValues,
  SingleUserFormFields,
} from './form-fields/single'
import { updateUserSchema } from '~/validation/backend/mutations/user/update'
import uniqBy from 'lodash.uniqby'
import groupBy from 'lodash.groupby'

export const EditUserForm = ({
  user,
  cycles,
}: {
  user: Omit<Selectable<User>, 'password'> & {
    cycles: (Selectable<UserCycle> & {
      curriculum:
        | (Selectable<Curriculum> & {
            track:
              | (Selectable<Track> & { course: Selectable<Course> | null })
              | null
          })
        | null
      cycle: Selectable<Cycle> | null
    })[]
  }
  cycles: Selectable<Cycle>[]
}) => {
  const router = useRouter()
  const form = useForm<EditUserFieldValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      ...user,
      ...(user.role === 'STUDENT'
        ? {
            student: {
              cycles: user?.cycles?.map((cycle) => ({
                label: cycle.cycle?.name,
                value: cycle.cycleId,
              })),
              curricula: user?.cycles?.reduce(
                (acc: object, cycle) => ({
                  ...acc,
                  [cycle.cycleId]: {
                    id: cycle.id,
                    courseId: cycle.curriculum?.track?.courseId,
                    trackId: cycle.curriculum?.trackId,
                    curriculumId: cycle.curriculumId,
                  },
                }),
                {},
              ),
            },
          }
        : {}),
      ...(user.role === 'CORRECTOR'
        ? {
            corrector: {
              cycles: uniqBy(user.cycles, (obj) => obj.cycleId).map(
                (cycle) => ({
                  label: cycle.cycle?.name,
                  value: cycle.cycleId,
                }),
              ),
              curricula: groupBy(
                user.cycles.map((c) => ({
                  cycleId: c.cycleId,
                  label: `${c.curriculum?.track?.course?.name}: ${c.curriculum?.name}`,
                  value: c.curriculumId,
                })),
                (obj) => obj.cycleId,
              ),
            },
          }
        : {}),
    },
  })

  const utils = api.useUtils()

  const mutation = api.user.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل بيانات المستخدم بنجاح')
      void utils.user.invalidate()

      if (history.state === null) router.push('/dashboard/users')
      else router.back()
    },
  })

  const onSubmit = (data: EditUserFieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <SingleUserFormFields form={form} cycles={cycles} />
        <div>
          <Button loading={mutation.isPending}>تعديل</Button>
        </div>
      </form>
    </Form>
  )
}
