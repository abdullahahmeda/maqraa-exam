export default function Register() {
  return <p>Register</p>
}

// import Head from 'next/head'
// import Image from 'next/image'
// import Link from 'next/link'
// import { FaEnvelope, FaUser } from 'react-icons/fa'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import Button from '../components/button'
// import { customErrorMap } from '../validation/customErrorMap'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '../server/auth'
// import { GetServerSidePropsContext } from 'next'
// import { registerSchema } from '../validation/registerSchema'
// import { api } from '../utils/api'
// import toast from 'react-hot-toast'
// import { useRouter } from 'next/router'
// import FieldErrorMessage from '../components/field-error-message'
// import WebsiteLayout from '../components/layout'

// type FieldValues = {
//   name: string
//   email: string
// }

// export default function RegisterPage() {
//   const studentCreate = api.users.createStudent.useMutation()
//   const router = useRouter()

//   const {
//     handleSubmit,
//     register,
//     formState: { errors: fieldsErrors },
//     setError,
//   } = useForm<FieldValues>({
//     resolver: zodResolver(registerSchema),
//   })

//   const onSubmit = (data: FieldValues) => {
//     studentCreate
//       .mutateAsync(data)
//       .then(() => {
//         toast.success('تم التسجيل بنجاح. يمكنك الآن تسجيل الدخول', {
//           duration: 5000,
//         })
//         router.push('/login')
//       })
//       .catch((error) => {
//         setError('root.serverError', {
//           message: error.message || 'حدث خطأ غير متوقع',
//           type: 'custom',
//         })
//       })
//   }

//   return (
//     <>
//       <Head>
//         <title>حفاظ الوحيين | تسجيل عضوية جديدة</title>
//       </Head>
//       <form
//         className='mx-auto max-w-[360px] pt-20'
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className='mb-4 text-center'>
//           <Link href='https://mqraa.alwahyaen.com/' className='inline-block'>
//             <Image
//               src='/maqraa_app.png'
//               alt='Logo'
//               width='230'
//               height='150'
//               className='inline-block'
//             />
//           </Link>
//         </div>
//         <div className='bg-white p-5 shadow'>
//           <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
//             تسجيل عضوية جديدة
//           </h1>
//           <div className='mb-2 '>
//             <div className='flex'>
//               <input
//                 type='name'
//                 className='peer flex-1 rounded rounded-l-none border border-[#ced4da] py-[.375rem] px-3 text-[#495057] transition-colors focus:border-[#d9b14d] focus:outline-0'
//                 placeholder='الاسم'
//                 {...register('name')}
//               />
//               <div className='flex items-center rounded rounded-r-none border border-[#ced4da] py-[.375rem] px-3 text-[#777] transition-colors peer-focus:border-[#80bdff]'>
//                 <FaUser />
//               </div>
//             </div>
//             <FieldErrorMessage>{fieldsErrors.name?.message}</FieldErrorMessage>
//           </div>
//           <div>
//             <div className='flex'>
//               <input
//                 type='email'
//                 className='peer flex-1 rounded rounded-l-none border border-[#ced4da] py-[.375rem] px-3 text-[#495057] transition-colors focus:border-[#d9b14d] focus:outline-0'
//                 placeholder='البريد الإلكتروني'
//                 {...register('email')}
//               />
//               <div className='flex items-center rounded rounded-r-none border border-[#ced4da] py-[.375rem] px-3 text-[#777] transition-colors peer-focus:border-[#80bdff]'>
//                 <FaEnvelope />
//               </div>
//             </div>
//             <FieldErrorMessage>{fieldsErrors.email?.message}</FieldErrorMessage>
//           </div>

//           <FieldErrorMessage>
//             {fieldsErrors?.root?.serverError?.message}
//           </FieldErrorMessage>
//           <Button className='mt-2' variant='primary'>
//             تسجيل
//           </Button>
//         </div>
//       </form>
//     </>
//   )
// }

// RegisterPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions)

//   if (session) {
//     return { redirect: { destination: '/' } }
//   }

//   return {
//     props: {},
//   }
// }
