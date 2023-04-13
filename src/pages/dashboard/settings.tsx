import Head from 'next/head'
import { useEffect } from 'react'
import DashboardLayout from '~/components/dashboard/layout'
import { api } from '~/utils/api'
import { enSettingToAr } from '~/utils/settings'
import { useForm } from 'react-hook-form'
import DashboardButton from '~/components/dashboard/button'
import FieldErrorMessage from '~/components/field-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateSettingsSchema,
  ValidSchema
} from '~/validation/updateSettingsSchema'
import { toast } from 'react-hot-toast'
import { SettingKey } from '~/constants'
import { customErrorMap } from '~/validation/customErrorMap'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSettings } from '~/services/settings'

type FieldValues = Record<SettingKey, string | number>

const SettingsPage = ({
  settings
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: fieldsErrors }
  } = useForm<FieldValues>({
    resolver: zodResolver(updateSettingsSchema, {
      errorMap: customErrorMap
    })
  })

  const settingsUpdate = api.settings.update.useMutation()

  useEffect(() => {
    if (settings) {
      const settingsObj = settings.reduce(
        (obj, s) => ({ ...obj, [s.key]: s.value }),
        {}
      )
      reset(settingsObj)
    }
  }, [reset, settings])

  const onSubmit = async (data: FieldValues) => {
    settingsUpdate
      .mutateAsync(data as ValidSchema)
      .then(() => {
        toast.success('تم حفظ الإعدادات بنجاح')
      })
      .catch(error => {
        if (error.message) toast.error(error.message)
        else toast.error('حدث خطأ غير متوقع')
      })
  }

  return (
    <>
      <Head>
        <title>الإعدادات</title>
      </Head>
      <div className='rounded-lg bg-gray-100 p-2'>
        <h2 className='text-center text-xl font-semibold'>الإعدادات</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {settings?.map(setting => (
            <div key={setting.key} className='mb-2'>
              <label htmlFor={setting.key} className='mb-1'>
                {enSettingToAr(setting.key as SettingKey)}
              </label>
              <input
                type='text'
                className='block w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
                {...register(setting.key as SettingKey, {
                  valueAsNumber: true
                })}
                id={setting.key}
              />
              <FieldErrorMessage>
                {fieldsErrors?.[setting.key as SettingKey]?.message}
              </FieldErrorMessage>
            </div>
          ))}
          <DashboardButton
            type='submit'
            variant='primary'
            loading={settingsUpdate.isLoading}
          >
            حفظ
          </DashboardButton>
        </form>
      </div>
    </>
  )
}

SettingsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

async function getServerSideProps (context: GetServerSidePropsContext) {
  const settings = await getSettings()
  return {
    props: {
      settings
    }
  }
}

export default SettingsPage
