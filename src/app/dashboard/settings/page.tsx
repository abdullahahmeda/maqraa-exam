import { SettingsForm } from './_components/form'
import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `إعدادت الموقع | ${siteName}`,
  }
}

const SettingsPage = async () => {
  const siteName = await api.setting.getSiteName()

  return (
    <div>
      <h2 className='text-center text-xl font-semibold'>الإعدادات</h2>
      <SettingsForm siteName={siteName} />
    </div>
  )
}

export default SettingsPage
