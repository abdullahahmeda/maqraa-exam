'use client'

import { api } from '~/utils/api'
import { BookOpenIcon, TrashIcon, EditIcon } from 'lucide-react'
import { Button, buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { useState } from 'react'
import { DeleteCourseModal } from './delete-course-modal'
import { EditCourseModal } from './edit-course-modal'


export function CoursesGrid() {
  const [courseToDelete, setCourseToDelete] = useState<string | undefined>()
  const [courseToEdit, setCourseToEdit] = useState<string | undefined>()
  const { data: courses } = api.course.getGridList.useQuery(undefined, {
    refetchOnMount: false,
  })

  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
      {courses?.map((course) => (
        <div key={course.id} className='rounded bg-secondary pb-4'>
          <a
            href={`/dashboard/courses/${course.id}`}
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'flex-col gap-2 p-4 whitespace-normal flex h-auto',
            )}
          >
            <BookOpenIcon className='mx-auto w-10 h-10' />
            <h4 className='text-center'>{course.name}</h4>
          </a>
          <div className='flex gap-2 mt-4 justify-center items-end px-4'>
            <Button onClick={() => setCourseToEdit(course.id)}>
              <EditIcon className='h-4 w-4 ml-2' />
              تعديل
            </Button>
            <Button
              variant='destructive'
              onClick={() => setCourseToDelete(course.id)}
            >
              <TrashIcon className='h-4 w-4 ml-2' />
              حذف
            </Button>
          </div>
        </div>
      ))}
      <DeleteCourseModal
        id={courseToDelete}
        setOpen={() => setCourseToDelete(undefined)}
      />
      <EditCourseModal
        id={courseToEdit}
        setOpen={() => setCourseToEdit(undefined)}
      />
    </div>
  )
}
