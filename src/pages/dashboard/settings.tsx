import Head from 'next/head'
import DashboardLayout, { menuLinks } from '~/components/dashboard/layout'
import { api } from '~/utils/api'

import { Control, useForm, UseFormRegister } from 'react-hook-form'
import { Button, buttonVariants } from '~/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import { GripVerticalIcon } from 'lucide-react'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Textarea } from '~/components/ui/textarea'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { useState } from 'react'
import { get } from 'lodash'

function getKeyAr(key: string) {
  return {
    '/dashboard': 'لوحة التحكم',
    '/dashboard/users': 'المستخدمين',
    '/dashboard/questions': 'الأسئلة',
    '/dashboard/questions/styles': 'أنواع الأسئلة',
    '/dashboard/system-exams': 'اختبارات النظام',
    '/dashboard/quizzes': 'الإختبارات التجريبية',
    '/dashboard/courses': 'المقررات',
    '/dashboard/curricula': 'المناهج',
    '/dashboard/cycles': 'الدورات',
    '/dashboard/tracks': 'المسارات',
    '/dashboard/error-reports': 'تبليغات الأخطاء',
    '/dashboard/reports': 'التقارير',
  }[key]
}

type FieldValues = {
  menuItems: { order: number; label: string; key: string; icon: string }[]
}
const MenuItem = ({
  item,
  control,
  index,
}: {
  item: { key: string; order: number; icon: string | null; label: string }
  index: number
  control: Control<FieldValues>
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      className={cn(
        'flex gap-4 rounded-md bg-white p-4 shadow',
        isDragging && 'opacity-70'
      )}
      style={style}
      key={item.key}
      ref={setNodeRef}
      {...attributes}
    >
      <Button
        variant='ghost'
        className={cn(
          'block h-auto cursor-grab active:cursor-grabbing',
          isDragging && 'bg-secondary'
        )}
        {...listeners}
      >
        <GripVerticalIcon className='h-4 w-4' />
      </Button>
      <div className='flex-grow space-y-4'>
        <p>
          رابط{' '}
          <Link className={buttonVariants({ variant: 'link' })} href={item.key}>
            {getKeyAr(item.key)}
          </Link>
        </p>
        <FormField
          name={`menuItems.${index}.label`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`menuItems.${index}.icon`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الأيكونة</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

const SettingsPage = ({
  menuItems: defaultMenuItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const form = useForm<FieldValues>({
    defaultValues: { menuItems: defaultMenuItems },
  })

  const { setValue, getValues, control, watch } = form

  const menuItems = watch('menuItems')

  const [activeData, setActiveData] = useState(null)

  const onDragStart = (event: DragStartEvent) => {
    const items = getValues('menuItems')
    const index = items.findIndex((item) => item.key === event.active.id)
    const item = items[index]
    setActiveData({ control, index, item })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const items = getValues('menuItems')
    const oldIndex = items.findIndex((item) => item.key === active.id)
    const newIndex = items.findIndex((item) => item.key === over.id)
    const newArray = arrayMove(items, oldIndex, newIndex)
    console.log(newArray)
    setValue('menuItems', newArray)
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveData(null)
  }

  // const settingsUpdate = api.settings.update.useMutation()

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
    console.log(data)
    // settingsUpdate
    //   .mutateAsync(data as any)
    //   .then(() => {
    //     toast.success('تم حفظ الإعدادات بنجاح')
    //   })
    //   .catch((error) => {
    //     if (error.message) toast.error(error.message)
    //     else toast.error('حدث خطأ غير متوقع')
    //   })
  }

  return (
    <>
      <Head>
        <title>الإعدادات</title>
      </Head>

      <h2 className='text-center text-xl font-semibold'>الإعدادات</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <h3>القائمة</h3>
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={menuItems}
              strategy={verticalListSortingStrategy}
            >
              {menuItems.map((item, index) => (
                <MenuItem
                  key={item.key}
                  control={control}
                  index={index}
                  item={item}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeData && <MenuItem {...activeData} />}
            </DragOverlay>
          </DndContext>
          <Button type='submit' loading={false}>
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  if (session?.user.role !== 'ADMIN') return { notFound: true }

  let menuItems = await db
    .selectFrom('MenuItem')
    .selectAll()
    .orderBy('MenuItem.order asc')
    .execute()

  menuItems = menuItems.length === 0 ? menuLinks.ADMIN : menuItems

  return {
    props: {
      session,
      menuItems,
    },
  }
}

export default SettingsPage
