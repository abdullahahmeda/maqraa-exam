import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '../../pages/_app'
import { useMemo, useState } from 'react'
import { api } from '~/utils/api'
import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Course, Cycle, StudentCycle, User, UserRole } from '@prisma/client'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { enUserRoleToAr, userRoleMapping } from '~/utils/users'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { DataTable } from '~/components/ui/data-table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Edit, Filter, Eye, Trash, UserPlus } from 'lucide-react'
import { getServerAuthSession } from '~/server/auth'
import { Combobox } from '~/components/ui/combobox'
import { EditUserDialog } from '~/components/modals/edit-user'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '~/components/ui/select'
import { AddUsersDialog } from '~/components/modals/add-user'
import { UserInfoModal } from '~/components/modals/user-info'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { DeleteUserDialog } from '~/components/modals/delete-user'

type Row = User & {
  student: { cycles: (StudentCycle & { cycle: Cycle })[] }
  corrector: {
    cycle: Cycle
    course: Course
  }
}

const columnHelper = createColumnHelper<Row>()

const PAGE_SIZE = 50

const UsersPage = () => {
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(false)

  const pageIndex = z
    .preprocess((v) => Number(v), z.number().positive().int())
    .safeParse(router.query.page).success
    ? Number(router.query.page) - 1
    : 0

  const pageSize = PAGE_SIZE

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const filters = columnFilters.map((filter) => {
    if (filter.id === 'cycles')
      return {
        student: { cycles: { some: { cycleId: filter.value as string } } },
      }
    return { [filter.id]: { equals: filter.value } }
  })

  const { data: users, isFetching: isFetchingUsers } =
    api.users.findMany.useQuery<any, Row[]>(
      {
        skip: pageIndex * pageSize,
        take: pageSize,
        where: { AND: filters },
        include: {
          student: { include: { cycles: { include: { cycle: true } } } },
          corrector: { include: { cycle: true, course: true } },
        },
      },
      { networkMode: 'always' }
    )

  const { data: count, isLoading: isCountLoading } = api.users.count.useQuery(
    { where: { AND: filters } },
    { networkMode: 'always' }
  )

  const pageCount =
    users !== undefined && count !== undefined
      ? Math.ceil(count / pageSize)
      : -1

  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: 'البريد الإلكتروني',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor('role', {
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined
          return (
            <div className='flex items-center'>
              الصلاحيات
              <Popover>
                <PopoverTrigger className='mr-4' asChild>
                  <Button
                    size='icon'
                    variant={filterValue ? 'secondary' : 'ghost'}
                  >
                    <Filter className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Select
                    value={filterValue === undefined ? '' : filterValue}
                    onValueChange={column.setFilterValue}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>الكل</SelectItem>
                      {Object.entries(userRoleMapping).map(([label, value]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            </div>
          )
        },
        cell: (info) => (
          <Badge
          // variant={info.getValue() === UserRole.ADMIN ? 'success' : 'warning'}
          >
            {enUserRoleToAr(info.getValue() || '')}
          </Badge>
        ),
        meta: {
          className: 'text-center',
        },
      }),
      columnHelper.accessor(
        (row) => row.student?.cycles.map((c) => c.cycle.name).join('، '),
        {
          id: 'cycles',
          header: ({ column }) => {
            const { data: cycles, isLoading } = api.cycles.findMany.useQuery({})
            const filterValue = column.getFilterValue() as string | undefined
            return (
              <div className='flex items-center'>
                الدورة
                <Popover>
                  <PopoverTrigger className='mr-4' asChild>
                    <Button
                      size='icon'
                      variant={filterValue ? 'secondary' : 'ghost'}
                    >
                      <Filter className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Combobox
                      items={[{ name: 'الكل', id: '' }, ...(cycles || [])]}
                      loading={isLoading}
                      labelKey='name'
                      valueKey='id'
                      onSelect={column.setFilterValue}
                      value={filterValue}
                      triggerText='الكل'
                      triggerClassName='w-full'
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )
          },
          cell: (info) => info.getValue() || '-',
          meta: {
            className: 'text-center',
          },
        }
      ),
      columnHelper.display({
        id: 'actions',
        cell: function Cell({ row }) {
          const [dialogOpen, setDialogOpen] = useState(false)

          return (
            <div className='flex justify-center gap-2'>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-blue-50'
                  >
                    <Eye className='h-4 w-4 text-blue-500' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <UserInfoModal id={row.original.id} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-orange-50'
                  >
                    <Edit className='h-4 w-4 text-orange-500' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EditUserDialog
                    id={row.original.id}
                    setDialogOpen={setDialogOpen}
                  />
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hover:bg-red-50'
                  >
                    <Trash className='h-4 w-4 text-red-600' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <DeleteUserDialog id={row.original.id} />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, columnFilters },
    manualFiltering: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Head>
        <title>المستخدمون</title>
      </Head>
      <div className='mb-2 flex items-center'>
        <h2 className='ml-2 text-2xl font-bold'>المستخدمون</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <UserPlus className='h-4 w-4' />
              إضافة مستخدمين
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddUsersDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      {/* <EditUserDialog
      title='تعديل بيانات المستخدم'
        open={!!userToEdit}
        setOpen={setUserToEdit}
        refetch={refetch}
        id={typeof userToEdit === 'string' ? userToEdit : null}
      /> */}
      <DataTable table={table} fetching={isFetchingUsers} />
    </>
  )
}

UsersPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== UserRole.ADMIN) return { notFound: true }

  return {
    props: {
      session,
    },
  }
}

export default UsersPage
