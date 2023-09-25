import { UseFormReturn } from 'react-hook-form'
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '../ui/form'
import { Input } from '../ui/input'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'

export type AddCycleFieldValues = { name: string }
export type EditCycleFieldValues = { id: string } & AddCycleFieldValues

type FormProps = {
  form: UseFormReturn<AddCycleFieldValues | EditCycleFieldValues>
  onSubmit: (data: AddCycleFieldValues | EditCycleFieldValues) => void
  isLoading?: boolean
  submitText: string
}

export const CycleForm = ({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: FormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الدورة</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type='submit'
            // variant='success'
            loading={isLoading}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
