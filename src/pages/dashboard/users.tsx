import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { useMemo, useState } from 'react'
import { api } from '~/utils/api'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
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
import { Pencil, Filter, Trash, UserPlus, InfoIcon } from 'lucide-react'
import { Combobox } from '~/components/ui/combobox'
import { EditUserDialog } from '~/components/modals/edit-user'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '~/components/ui/select'
import { NewUsersDialog } from '~/components/modals/new-user'
import { UserInfoModal } from '~/components/modals/user-info'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { DeleteUserDialog } from '~/components/modals/delete-user'
import { Input } from '~/components/ui/input'
import { getColumnFilters } from '~/utils/getColumnFilters'
import { UserRole } from '~/kysely/enums'
import { Cycle, UserCycle, User } from '~/kysely/types'
import { Checkbox } from '~/components/ui/checkbox'
import { Selectable } from 'kysely'
import { deleteRows } from '~/utils/client/deleteRows'
import { DataTableActions } from '~/components/ui/data-table-actions'
import { RowActions } from '~/components/ui/row-actions'
import { showDialog } from '~/lib/dialog'

type Row = Selectable<User> & {
  // student: { cycles: (UserCycle & { cycle: Cycle })[] }
  cycles: UserCycle & { cycle: Cycle }[]
}

const columnFiltersValidators = {
  email: z.string(),
  role: z.nativeEnum(UserRole),
  cycleId: z.string(),
}

const columnHelper = createColumnHelper<Row>()

const PAGE_SIZE = 25

const UsersPage = () => {
  const router = useRouter()
  const utils = api.useUtils()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

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

  const bulkDeleteMutation = api.user.bulkDelete.useMutation()
  const deleteAllMutation = api.user.deleteAll.useMutation()

  const columnFilters: ColumnFiltersState = getColumnFilters(
    router.query,
    columnFiltersValidators
  )

  const filters = columnFilters.reduce(
    (obj, f) => ({ ...obj, [f.id]: f.value }),
    {}
  )

  const { data: users, isFetching: isFetchingUsers } = api.user.list.useQuery(
    {
      pagination,
      filters,
      include: {
        cycles: {
          cycle: true,
        },
      },
    },
    { networkMode: 'always' }
  )

  const invalidate = utils.user.invalidate

  const pageCount =
    users?.data !== undefined && typeof users?.count === 'number'
      ? Math.ceil(users?.count / pageSize)
      : -1

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? table.getIsAllPageRowsSelected()
                : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='تحديد الكل'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='تحديد الصف'
          />
        ),
      }),
      columnHelper.accessor('email', {
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined
          return (
            <div className='flex items-center justify-center'>
              البريد الإلكتروني
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
                  <Input
                    value={filterValue === undefined ? '' : filterValue}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        },
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('name', {
        header: 'الاسم',
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor('role', {
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined
          return (
            <div className='flex items-center justify-center'>
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
        cell: (info) => <Badge>{enUserRoleToAr(info.getValue() || '')}</Badge>,
        meta: {
          textAlign: 'center',
        },
      }),
      columnHelper.accessor(
        (row) => row.cycles?.map((c) => c.cycle.name).join('، '),
        {
          id: 'cycleId',
          header: ({ column }) => {
            const { data: cycles, isLoading } = api.cycle.list.useQuery()
            const filterValue = column.getFilterValue() as string | undefined
            return (
              <div className='flex items-center justify-center'>
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
                      items={[
                        { name: 'الكل', id: '' },
                        ...(cycles?.data || []),
                      ]}
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
            textAlign: 'center',
          },
        }
      ),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: function Cell({ row }) {
          const [dialogOpen, setDialogOpen] = useState(false)

          return (
            // <RowActions
            //   infoButton={{
            //     onClick: () =>
            //       showDialog({
            //         title: 'tew',
            //       }),
            //   }}
            //   editButton={{}}
            //   deleteButton={{}}
            // />
            //
            <div className='flex justify-center gap-2'>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-blue-50'
                  >
                    <InfoIcon className='h-4 w-4 text-blue-500' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <UserInfoModal id={row.original.id as unknown as string} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-orange-50'
                  >
                    <Pencil className='h-4 w-4 text-orange-500' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EditUserDialog
                    id={row.original.id as unknown as string}
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
                  <DeleteUserDialog id={row.original.id as unknown as string} />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
        meta: {
          textAlign: 'center',
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: (users?.data as any[]) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    manualPagination: true,
    state: { pagination, columnFilters, rowSelection },
    enableRowSelection: true,
    manualFiltering: true,
    onPaginationChange: (updater) => {
      const newPagination: PaginationState = (updater as CallableFunction)(
        pagination
      )
      router.query.page = `${newPagination.pageIndex + 1}`
      router.push(router)
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: (updater) => {
      const newColumnFilters: ColumnFiltersState = (
        updater as CallableFunction
      )(columnFilters)
      Object.keys(columnFiltersValidators).forEach((filterId) => {
        delete router.query[filterId]
      })
      newColumnFilters.forEach((filter) => {
        ;(router.query as any)[filter.id] = filter.value
      })
      router.push(router)
    },
  })
  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((item) => item.original)

  const handleBulkDelete = () => {
    deleteRows({
      mutateAsync: () =>
        bulkDeleteMutation.mutateAsync(selectedRows.map((r) => r.id)),
      invalidate,
      setRowSelection,
    })
  }

  const handleDeleteAll = () => {
    deleteRows({
      mutateAsync: deleteAllMutation.mutateAsync,
      invalidate,
    })
  }

  return (
    <>
      <Head>
        <title>المستخدمون</title>
      </Head>
      <div className='mb-4 flex items-center'>
        <h2 className='ml-4 text-2xl font-bold'>المستخدمون</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <UserPlus className='h-4 w-4' />
              إضافة مستخدمين
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewUsersDialog setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTableActions
        deleteAll={{
          handle: handleDeleteAll,
          data: { disabled: users?.count === 0 },
        }}
        bulkDelete={{ handle: handleBulkDelete, data: { selectedRows } }}
      />
      <DataTable table={table} fetching={isFetchingUsers} />
    </>
  )
}

UsersPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export default UsersPage
