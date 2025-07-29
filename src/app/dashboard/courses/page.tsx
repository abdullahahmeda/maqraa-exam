import { buttonVariants } from '~/components/ui/button'
import { CoursesGrid } from './_components/grid'
import { AddCourseButton } from './_components/add-course-button'
import { api } from '~/trpc/server'
import { getCourseList } from '~/services/course'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `المقررات | ${siteName}`,
  }
}

export default async function CoursesPage() {
  const courses = await getCourseList(undefined, 'grid')

  return (
    <>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المقررات</h2>
        <AddCourseButton />
      </div>
      <CoursesGrid initialData={courses} />
    </>
  )
}
