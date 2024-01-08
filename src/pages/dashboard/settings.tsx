import Head from 'next/head'
import DashboardLayout, { menuLinks } from '~/components/dashboard/layout'
import { api } from '~/utils/api'

import { useForm, UseFormRegister } from 'react-hook-form'
import { Button } from '~/components/ui/button'
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
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Textarea } from '~/components/ui/textarea'

type FieldValues = {
  menuItems: { order: number; label: string; key: string }[]
}
const MenuItem = ({
  item,
  register,
  index,
}: {
  item: { key: string; order: number; icon: string | undefined; label: string }
  index: number
  register: UseFormRegister<FieldValues>
}) => {
  const {
    attributes: { role, ...attributes },
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      className='flex gap-4 rounded-md bg-white p-4 shadow'
      style={style}
      key={item.key}
      ref={setNodeRef}
      {...attributes}
    >
      <button className='cursor-grab active:cursor-grabbing' {...listeners}>
        <GripVerticalIcon className='h-4 w-4' />
      </button>
      <div className='flex-grow space-y-4'>
        <Input {...register(`menuItems.${index}.label`)} />
        <Textarea
          className='text-left'
          style={{ direction: 'ltr' }}
          {...register(`menuItems.${index}.icon`)}
        />
      </div>
    </div>
  )
}

const SettingsPage = ({
  menuItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const form = useForm<FieldValues>({
    defaultValues: { menuItems },
  })

  const { setValue, getValues } = form

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      const items = getValues('menuItems').concat()
      ;[items[active.id], items[over.id]] = [items[over.id], items[active.id]]
      setValue('menuItems', items)
    }
  }

  const { register } = form

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
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={getValues('menuItems')}
              strategy={verticalListSortingStrategy}
            >
              {menuItems.map((item, index) => (
                <MenuItem
                  key={item.key}
                  register={register}
                  index={index}
                  item={item}
                />
              ))}
            </SortableContext>
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
