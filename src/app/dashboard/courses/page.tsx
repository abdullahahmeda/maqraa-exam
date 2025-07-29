import { CoursesGrid } from './_components/grid'
import { AddCourseButton } from './_components/add-course-button'
import { api, HydrateClient } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المقررات | ${siteName}`,
  }
}

export default async function CoursesPage() {
  await api.course.getGridList.prefetch(undefined)

  return (
    <HydrateClient>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المقررات</h2>
        <AddCourseButton />
      </div>
      <CoursesGrid />
    </HydrateClient>
  )
}
