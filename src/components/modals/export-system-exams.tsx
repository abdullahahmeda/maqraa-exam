import { useToast } from '../ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/api'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import { exportSystemExamsSchema } from '~/validation/exportSystemExamsSchema'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Combobox } from '../ui/combobox'
import { saveAs } from 'file-saver'
import { Button } from '../ui/button'

type FieldValues = {
  cycleId: string
}

export const ExportSystemExamsDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const { toast } = useToast()
  const form = useForm<FieldValues>({
    resolver: zodResolver(exportSystemExamsSchema),
  })

  const { data: cycles, isLoading: isCyclesLoading } =
    api.cycle.findMany.useQuery({})

  const systemExamsExport = api.exportSystemExams.useMutation()

  const onSubmit = async (data: FieldValues) => {
    setDialogOpen(false)
    const t = toast({ title: 'يتم تجهيز الملف للتحميل...' })
    systemExamsExport
      .mutateAsync({ cycleId: data.cycleId })
      .then((arrayBuffer) => {
        const content = new Blob([arrayBuffer])
        saveAs(content, `الإختبارات.xlsx`)
        toast({ title: 'تم بدأ تحميل الملف' })
      })
      .catch(() => {
        toast({ title: 'حدث خطأ أثناء تحميل الملف' })
      })
      .finally(() => {
        t.dismiss()
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        تصدير إختبارات دورة
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='cycleId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدورة</FormLabel>
                <FormControl>
                  <Combobox
                    items={cycles || []}
                    loading={isCyclesLoading}
                    value={field.value}
                    labelKey='name'
                    valueKey='id'
                    onSelect={field.onChange}
                    triggerText='اختر الدورة المراد تصديرها'
                    triggerClassName='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type='submit'>تحميل</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
