import { api, HydrateClient } from '~/trpc/server'
import { notFound } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { TracksGrid } from './tracks-grid'
import { AddTrackButton } from './add-track-button'

type Props = {
  params: Promise<{
    courseId: string
  }>
}
export default async function ShowCoursePage(props: Props) {
  const params = await props.params
  await api.course.getOneForShow.prefetch({ id: params.courseId })
  const course = await api.course.getOneForShow({ id: params.courseId })
  if (!course) notFound()

  return (
    <HydrateClient>
      <div>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard/courses'>
                المقررات
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{course.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='mb-4 flex items-center'>
          <h2 className='ml-4 text-2xl font-bold'>المسارات</h2>
          <AddTrackButton courseId={params.courseId} />
        </div>
        <TracksGrid courseId={params.courseId} />
      </div>
    </HydrateClient>
  )
}
