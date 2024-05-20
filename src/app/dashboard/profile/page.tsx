import { getServerAuthSession } from '~/server/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from './_components/form'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `تعديل الحساب | ${siteName}`,
  }
}

const ProfilePage = async () => {
  const session = await getServerAuthSession()

  const user = await api.user.get({ id: session!.user.id })

  // I don't know this case
  if (!user) return redirect('/')

  return (
    <div className='rounded-md bg-white p-4 border'>
      <h2 className='mb-4 text-xl font-bold'>تعديل الحساب</h2>
      <ProfileForm user={{ name: user.name, phone: user.phone }} />
    </div>
  )
}

export default ProfilePage
