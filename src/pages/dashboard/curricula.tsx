import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { Fragment, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FieldErrorMessage from '~/components/field-error-message'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import toast from 'react-hot-toast'
import DashboardButton from '~/components/dashboard/button'
import { Course, Curriculum } from '@prisma/client'
import Spinner from '~/components/spinner'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import Pagination from '~/components/pagination'
import { customErrorMap } from '~/validation/customErrorMap'
import DashboardTable from '~/components/dashboard/table'
import Select from '~/components/select'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import Dialog, { DialogActions } from '~/components/dialog'

type FieldValues = {
  course: null | number
  name: string
  pages: {
    from: number
    to: number
  }
}

const AddCurriculumDialog = ({
  open,
  setOpen,
  refetch
}: {
  open: boolean
  setOpen: any
  refetch: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldsErrors },
    reset: resetForm
  } = useForm<FieldValues>({
    resolver: zodResolver(newCurriculumSchema, {
      errorMap: customErrorMap
    })
  })
  const curriculumCreate = api.curricula.create.useMutation()

  const { data: courses } = api.courses.fetchAll.useQuery()
  const closeModal = () => setOpen(false)

  const onSubmit = (data: FieldValues) => {
    const t = toast.loading('جاري إضافة المنهج')
    curriculumCreate
      .mutateAsync(data as z.infer<typeof newCurriculumSchema>)
      .then(() => {
        toast.dismiss(t)
        resetForm()
        toast.success('تم إضافة المنهج بنجاح')
        closeModal()
        refetch()
      })
      .catch(error => {
        toast.dismiss(t)
        toast.error(error.message)
      })
  }
  return (
    <Dialog open={open} setOpen={setOpen} title='إضافة منهج'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-2'>
          <label htmlFor='course'>المقرر</label>
          <Select
            disabled={!courses || courses.length === 0}
            className='w-full'
            id='course'
            {...register('course', {
              valueAsNumber: true
            })}
          >
            {!!courses && courses?.length > 0 ? (
              <>
                <option value={undefined}>اختر المقرر</option>
                {courses?.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </>
            ) : (
              <option>لا يوجد خيارات</option>
            )}
          </Select>
          <FieldErrorMessage>{fieldsErrors.course?.message}</FieldErrorMessage>
        </div>
        <div className='mb-2'>
          <label htmlFor='name'>الاسم</label>
          <input
            type='text'
            id='name'
            {...register('name')}
            className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
          />
          <FieldErrorMessage>{fieldsErrors.name?.message}</FieldErrorMessage>
        </div>
        <div className='mb-2'>
          <div className='flex gap-1'>
            <div>
              <label htmlFor='from-page'>من صفحة</label>
              <input
                type='number'
                id='from-page'
                min={1}
                className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
                {...register('pages.from', {
                  valueAsNumber: true
                })}
              />
              <FieldErrorMessage>
                {fieldsErrors.pages?.from?.message}
              </FieldErrorMessage>
            </div>
            <div>
              <label htmlFor='to-page'>إلى صفحة</label>
              <input
                type='number'
                id='to-page'
                className='w-full border border-zinc-300 p-2 outline-0 focus:border-zinc-400'
                {...register('pages.to', {
                  valueAsNumber: true
                })}
              />
              <FieldErrorMessage>
                {fieldsErrors.pages?.to?.message}
              </FieldErrorMessage>
            </div>
          </div>
          <FieldErrorMessage>{fieldsErrors.pages?.message}</FieldErrorMessage>
        </div>
        <DialogActions>
          <DashboardButton
            type='submit'
            variant='success'
            loading={curriculumCreate.isLoading}
          >
            إضافة
          </DashboardButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const DeleteCurriculumDialog = ({
  open,
  setOpen,
  refetch,
  id
}: {
  open: boolean
  setOpen: any
  refetch: any
  id: number | null
}) => {
  const curriculumDelete = api.curricula.delete.useMutation()
  const closeModal = () => setOpen(false)

  const deleteCurriculum = () => {
    const t = toast.loading('جاري حذف المنهج')
    curriculumDelete
      .mutateAsync({
        id: id!
      })
      .then(() => {
        toast.dismiss(t)
        toast.success('تم حذف المنهج بنجاح')
        closeModal()
        refetch()
      })
      .catch(error => {
        toast.dismiss(t)
        toast.error(error.message)
      })
  }

  return (
    <Dialog open={open} setOpen={setOpen} title='هل أنت متأكد؟'>
      <p className='mb-2'>
        هل تريد حقاً حذف هذا المنهج؟ هذا سيحذف الإختبارات المرتبطة به أيضاً
      </p>
      <DialogActions>
        <div className='flex items-center gap-2'>
          <DashboardButton variant='success' onClick={deleteCurriculum}>
            تأكيد
          </DashboardButton>
          <DashboardButton onClick={closeModal}>إلغاء</DashboardButton>
        </div>
      </DialogActions>
    </Dialog>
  )
}

type Props = {
  page: number
}

const columnHelper = createColumnHelper<
  Curriculum & {
    course: {
      name: string
    }
  }
>()

const PAGE_SIZE = 50

const CurriculaPage = ({ page: initialPage }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [curriculumToDelete, setCurriculumToDelete] = useState<
    boolean | number
  >(false)

  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialPage - 1,
    pageSize: PAGE_SIZE
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: PAGE_SIZE
    }),
    [pageSize, pageIndex]
  )

  const {
    data,
    isLoading: isLoadingCurricula,
    isRefetching: isRefetchingCurricula,
    refetch,
    isLoadingError,
    isRefetchError
  } = api.curricula.list.useQuery(
    {
      page: pageIndex + 1
    },
    {
      networkMode: 'always'
    }
  )

  const pageCount = data !== undefined ? Math.ceil(data.count / pageSize) : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.accessor('course.name', {
        header: 'المقرر',
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.display({
        id: 'pages',
        header: 'الصفحات',
        cell: info =>
          'من ' +
          info.row.original.fromPage +
          ' إلى ' +
          info.row.original.toPage,
        meta: {
          className: 'text-center'
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className='flex justify-center gap-2'>
            {/* <DashboardButton variant='primary'>عرض المناهج</DashboardButton> */}
            <DashboardButton
              variant='error'
              onClick={() => setCurriculumToDelete(row.original.id)}
            >
              حذف
            </DashboardButton>
          </div>
        ),
        meta: {
          className: 'text-center'
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data: data?.curricula || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount,
    manualPagination: true,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  const openModal = () => setIsModalOpen(true)

  const changePageIndex = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    router.replace(
      {
        query: { ...router.query, page: pageIndex + 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  return (
    <>
      <Head>
        <title>المناهج</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المناهج</h2>
        <DashboardButton onClick={openModal} variant='primary'>
          إضافة منهج
        </DashboardButton>
      </div>
      <AddCurriculumDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetch={refetch}
      />
      <DeleteCurriculumDialog
        open={!!curriculumToDelete}
        setOpen={setCurriculumToDelete}
        refetch={refetch}
        id={typeof curriculumToDelete === 'number' ? curriculumToDelete : null}
      />
      {isRefetchingCurricula && (
        <span className='mt-2 flex items-center gap-1 rounded bg-blue-200 p-2'>
          <Spinner />
          جاري تحديث البيانات...
        </span>
      )}
      {isRefetchError && (
        <span className='mt-2 flex items-center rounded bg-red-200 p-2'>
          حدث خطأ أثناء تحديث البيانات، تأكد من اتصال الانترنت
        </span>
      )}
      <DashboardTable
        table={table}
        isLoading={isLoadingCurricula}
        isLoadingError={isLoadingError}
        refetch={refetch}
      />

      <nav className='flex justify-center'>
        <Pagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          changePageIndex={changePageIndex}
        />
      </nav>
    </>
  )
}

CurriculaPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export const getServerSideProps: GetServerSideProps = async context => {
  const _page = context.query.page
  const pageData = z.number().positive().int().safeParse(Number(_page))

  return {
    props: {
      page: pageData.success ? pageData.data : 1
    }
  }
}

export default CurriculaPage
