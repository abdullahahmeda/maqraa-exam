import { api } from '~/trpc/server'

export async function generateMetadata() {
  const siteName = await api.setting.getSiteName()

  return {
    title: `لوحة التحكم | ${siteName}`,
  }
}
export default function Dashboard() {
  return <p>hello</p>
}
