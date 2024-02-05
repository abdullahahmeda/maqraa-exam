import Head from 'next/head'
import DashboardLayout, { menuLinks } from '~/components/dashboard/layout'
import { toast } from 'sonner'
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button, buttonVariants } from '~/components/ui/button'
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
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { Textarea } from '~/components/ui/textarea'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { useState, useEffect } from 'react'
import { SettingKey, UserRole } from '~/kysely/enums'
import { api } from '~/utils/api'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '~/components/ui/tabs'

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
    '/dashboard/my-exams': 'إختبارات النظام',
    '/start-quiz': 'بدأ اختبار تجريبي',
  }[key]
}

type FieldValues = {
  [SettingKey.SITE_NAME]: string
  menuItems: Record<
    UserRole,
    { order: number; label: string; key: string; icon: string | null }[]
  >
}
const MenuItem = ({
  item,
  control,
  index,
  role,
}: {
  item: { key: string; order: number; icon: string | null; label: string }
  index: number
  control: Control<FieldValues>
  role: string
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

  const icon = useWatch({
    control,
    name: `menuItems.${role as UserRole}.${index}.icon`,
  })

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
          name={`menuItems.${role as UserRole}.${index}.label`}
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
          name={`menuItems.${role as UserRole}.${index}.icon`}
          control={control}
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>الأيكونة</FormLabel>
              <FormControl>
                <Textarea value={value ?? undefined} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {icon && (
          <div className='flex items-center gap-2'>
            <p>صورة الأيكونة:</p>
            <div dangerouslySetInnerHTML={{ __html: icon }} />
          </div>
        )}
      </div>
    </div>
  )
}

const SettingsPage = ({
  siteName,
  menuItems: defaultMenuItems,
}: InferGetServerSidePropsType<typeof getServerSideProps> & {
  siteName: string
}) => {
  const form = useForm<FieldValues>({
    defaultValues: {
      menuItems: defaultMenuItems,
      [SettingKey.SITE_NAME]: siteName,
    },
  })

  const utils = api.useUtils()
  const [selectedMenu, setSelectedMenu] = useState<UserRole>(UserRole.ADMIN)
  const { getValues, control, watch, setValue } = form

  useEffect(() => {
    setValue(SettingKey.SITE_NAME, siteName)
  }, [setValue, siteName])

  const menuItems = watch('menuItems')
  const { swap: swapAdmin } = useFieldArray({
    control,
    name: 'menuItems.ADMIN',
  })
  const { swap: swapCorrector } = useFieldArray({
    control,
    name: 'menuItems.CORRECTOR',
  })
  const { swap: swapStudent } = useFieldArray({
    control,
    name: 'menuItems.STUDENT',
  })

  const [activeData, setActiveData] = useState<any>(null)

  const onDragStart = (event: DragStartEvent) => {
    const items = getValues('menuItems')[selectedMenu]
    const index = items.findIndex((item) => item.key === event.active.id)
    const item = items[index]
    setActiveData({ control, index, item })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const items = getValues('menuItems')[selectedMenu]
    const oldIndex = items.findIndex((item) => item.key === active.id)
    const newIndex = items.findIndex((item) => item.key === over?.id)
    if (selectedMenu === 'ADMIN') swapAdmin(oldIndex, newIndex)
    else if (selectedMenu === 'CORRECTOR') swapCorrector(oldIndex, newIndex)
    else if (selectedMenu === 'STUDENT') swapStudent(oldIndex, newIndex)
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveData(null)
  }

  const settingsUpdate = api.setting.update.useMutation()

  const onSubmit = async (data: FieldValues) => {
    settingsUpdate
      .mutateAsync(data)
      .then(() => {
        toast.success('تم حفظ الإعدادات بنجاح')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.setting.invalidate()
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
          <FormField
            control={control}
            name={SettingKey.SITE_NAME}
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الموقع</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h3 className='text-lg font-semibold'>القائمة الجانبية</h3>
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <Tabs
              defaultValue={UserRole.ADMIN}
              onValueChange={(value) => setSelectedMenu(value as UserRole)}
            >
              <TabsList>
                <TabsTrigger value={UserRole.ADMIN}>الأدمن</TabsTrigger>
                <TabsTrigger value={UserRole.CORRECTOR}>المصحح</TabsTrigger>
                <TabsTrigger value={UserRole.STUDENT}>الطالب</TabsTrigger>
              </TabsList>
              <TabsContent className='space-y-4' value={UserRole.ADMIN}>
                <SortableContext
                  items={menuItems.ADMIN as any}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.ADMIN.map((item, index) => (
                    <MenuItem
                      key={item.key}
                      control={control}
                      index={index}
                      item={item}
                      role='ADMIN'
                    />
                  ))}
                </SortableContext>
              </TabsContent>
              <TabsContent className='space-y-4' value={UserRole.CORRECTOR}>
                <SortableContext
                  items={menuItems.CORRECTOR as any}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.CORRECTOR.map((item, index) => (
                    <MenuItem
                      key={item.key}
                      control={control}
                      index={index}
                      item={item}
                      role='CORRECTOR'
                    />
                  ))}
                </SortableContext>
              </TabsContent>
              <TabsContent className='space-y-4' value={UserRole.STUDENT}>
                <SortableContext
                  items={menuItems.STUDENT as any}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.STUDENT.map((item, index) => (
                    <MenuItem
                      key={item.key}
                      control={control}
                      index={index}
                      item={item}
                      role='STUDENT'
                    />
                  ))}
                </SortableContext>
              </TabsContent>
            </Tabs>
            <DragOverlay>
              {activeData && <MenuItem {...activeData} role={selectedMenu} />}
            </DragOverlay>
          </DndContext>
          <Button type='submit' loading={settingsUpdate.isPending}>
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

  let allMenuItems = await db
    .selectFrom('MenuItem')
    .selectAll()
    .orderBy('MenuItem.order', 'asc')
    .execute()

  const menuItems: any = {}
  for (const item of allMenuItems) {
    if (menuItems[item.role]) menuItems[item.role].push(item)
    else menuItems[item.role] = [item]
  }

  return {
    props: {
      session,
      menuItems: menuItems as Record<
        UserRole,
        {
          icon: string | null
          label: string
          key: string
          order: number
        }[]
      >,
    },
  }
}

export default SettingsPage
