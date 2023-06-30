import Head from 'next/head'
import { useEffect } from 'react'
import DashboardLayout from '~/components/dashboard/layout'
import { api } from '~/utils/api'
import { enSettingToAr } from '~/utils/settings'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateSettingsSchema,
  ValidSchema,
} from '~/validation/updateSettingsSchema'
import { toast } from 'react-hot-toast'
import { SettingKey } from '~/constants'
import { customErrorMap } from '~/validation/customErrorMap'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSettings } from '~/services/settings'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

type FieldValues = Record<SettingKey, string | number>

const SettingsPage = ({
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const form = useForm<FieldValues>({
    defaultValues: settings.reduce(
      (obj, s) => ({ ...obj, [s.key]: s.value }),
      {}
    ),
    resolver: zodResolver(updateSettingsSchema, {
      errorMap: customErrorMap,
    }),
  })

  const settingsUpdate = api.settings.update.useMutation()

  // useEffect(() => {
  //   if (settings) {
  //     const settingsObj = settings.reduce(
  //       (obj, s) => ({ ...obj, [s.key]: s.value }),
  //       {}
  //     )
  //     form.reset(settingsObj)
  //   }
  // }, [settings])

  const onSubmit = async (data: FieldValues) => {
    settingsUpdate
      .mutateAsync(data as ValidSchema)
      .then(() => {
        toast.success('تم حفظ الإعدادات بنجاح')
      })
      .catch((error) => {
        if (error.message) toast.error(error.message)
        else toast.error('حدث خطأ غير متوقع')
      })
  }

  return (
    <>
      <Head>
        <title>الإعدادات</title>
      </Head>

      <h2 className='text-center text-xl font-semibold'>الإعدادات</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {settings?.map((setting) => (
            <FormField
              key={setting.key}
              control={form.control}
              name={setting.key as SettingKey}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={setting.key}>
                    {enSettingToAr(setting.key as SettingKey)}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type='submit' loading={settingsUpdate.isLoading}>
            حفظ
          </Button>
        </form>
      </Form>
    </>
  )
}

SettingsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const settings = await getSettings()
  return {
    props: {
      settings,
    },
  }
}

export default SettingsPage
