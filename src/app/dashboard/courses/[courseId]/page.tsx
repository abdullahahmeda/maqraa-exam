import { api } from '~/trpc/server'
import { notFound } from 'next/navigation'
import { TrainTrackIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import { Separator } from '~/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { EditTrackButton } from './edit-track-button'
import { DeleteTrackButton } from './delete-track-button'
import { DeleteCurriculumButton } from './delete-curriculum-button'
import { AddCurriculumButton } from './add-curriculum-button'
import { EditCurriculumButton } from './edit-curriculum-button'

type Props = {
  params: {
    courseId: string
  }
}
export default async function ShowCoursePage({ params }: Props) {
  const course = await api.course.getDataForShow({ id: params.courseId })
  if (!course) notFound()

  return (
    <div>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard/courses'>المقررات</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المسارات</h2>
        <Link
          href={`/dashboard/tracks/new?courseId=${course.id}`}
          className={buttonVariants()}
        >
          <PlusIcon className='ml-2 h-4 w-4' />
          إضافة مسار
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 items-start gap-4'>
        {course.tracks.map((track) => (
          <div key={track.id} className='rounded p-4 text-center bg-gray-100'>
            <TrainTrackIcon className='mx-auto w-10 h-10' />
            <h4>{track.name}</h4>
            <div className='mt-4 flex gap-1 justify-center'>
              <EditTrackButton id={track.id} />
              <DeleteTrackButton id={track.id} />
            </div>
            <Separator className='my-2' />
            <div className='text-right'>
              <Accordion type='single' collapsible>
                <AccordionItem
                  className='border-b-0'
                  value={`item-${track.id}`}
                >
                <div className='flex items-center gap-2'>
                  <AddCurriculumButton trackId={track.id} />
                  <AccordionTrigger>
                    <h4 className='font-semibold text-lg'>المناهج</h4>
                  </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className='space-y-2'>
                      {track.curricula.map((curriculum) => (
                        <div
                          key={curriculum.id}
                          className='flex justify-between items-center'
                        >
                          <p>{curriculum.name}</p>
                          <div className='flex gap-1'>
                            <EditCurriculumButton id={curriculum.id} />
                            <DeleteCurriculumButton id={curriculum.id} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
