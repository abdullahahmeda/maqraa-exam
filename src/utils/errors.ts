import { TRPCClientError } from '@trpc/client'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { inferFlattenedErrors, ZodIssue } from 'zod'

export function populateFormWithErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown
) {
  if (error instanceof TRPCClientError) {
    const zodError = error.data?.zodError as inferFlattenedErrors<any, ZodIssue>
    if (zodError) {
      console.log(zodError)
      if (zodError.formErrors.length > 0) {
        form.setError('root.serverError', {
          message: zodError.formErrors[0]!.message,
        })
      }

      Object.values(zodError.fieldErrors).forEach((issues) => {
        const error = issues?.[0]
        if (error) {
          const path = error.path.join('.')
          form.setError(path as FieldPath<T>, {
            message: error.message,
          })
        }
      })
    }
  }
}
