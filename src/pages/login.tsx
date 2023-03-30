import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../validation/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/button'
import { customErrorMap } from '../validation/customErrorMap'

type FieldValues = {
  email: string
}

const defaultValues: FieldValues = {
  email: ''
}

export default function LoginPage () {
  const {
    handleSubmit,
    register,
    formState: { errors: fieldsErrors }
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(loginSchema, {
      errorMap: customErrorMap
    })
  })

  const onSubmit = (data: FieldValues) => {
    // if (!IsEmail(inputRef.current.value)) {
    //   setError('هذا البريد الالكتروني غير صحيح')
    //   inputRef.current.focus()
    //   return
    // }

    console.log('hello :)')
  }

  return (
    <>
      <style global jsx>{`
        body {
          background: linear-gradient(
              to bottom,
              rgba(92, 77, 66, 0.9) 0%,
              rgba(92, 77, 66, 0.9) 100%
            ),
            url(/bg.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-size: cover;
          height: 100vh;
        }
      `}</style>
      <Head>
        <title>حفاظ الوحيين | تسجيل الدخول للاختبار</title>
      </Head>
      <form
        className='mx-auto max-w-[360px] pt-20'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='mb-4 text-center'>
          <Link href='https://mqraa.alwahyaen.com/' className='inline-block'>
            <Image
              src='/maqraa_app.png'
              alt='Logo'
              width='230'
              height='150'
              className='inline-block'
            />
          </Link>
        </div>
        <div className='bg-white p-5 shadow'>
          <div className='flex'>
            <input
              type='email'
              className='peer flex-1 rounded rounded-l-none border border-[#ced4da] py-[.375rem] px-3 text-[#495057] transition-colors focus:border-[#d9b14d] focus:outline-0'
              placeholder='البريد الإلكتروني'
              {...register('email')}
            />
            <div className='flex items-center rounded rounded-r-none border border-[#ced4da] py-[.375rem] px-3 text-[#777] transition-colors peer-focus:border-[#80bdff]'>
              <FaEnvelope />
            </div>
          </div>
          <p className='text-[#dc3545]'>{fieldsErrors.email?.message}</p>
          <Button className='mt-2' variant='primary'>
            أرسل الرمز
          </Button>
        </div>
      </form>
    </>
  )
}
