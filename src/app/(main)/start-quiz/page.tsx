import { api } from '~/trpc/server'
import { StartQuizForm } from './_components/form'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `بدأ اختبار تجريبي | ${siteName}`,
  }
}

const HomePage = async () => {
  const courses = await api.course.list()

  return (
    <>
      <div className='container mx-auto py-10'>
        <div className='mx-auto max-w-md rounded-md bg-white p-4 border'>
          <StartQuizForm courses={courses.data} />
        </div>
      </div>
    </>
  )
}

export default HomePage
