import { TRPCClientError } from '@trpc/client'

export const handleFormError = (
  error: unknown,
  handlers: {
    fields: (key: string, errorMessage: string) => void
    form: (errorMessage: string) => void
    default: (errorMessage: string) => void
  },
  defaultMessage = 'حدث خطأ'
): void => {
  let message = defaultMessage
  let receivedFeedback = false
  if (error instanceof TRPCClientError) {
    message = error.message
    if (error.data.zodError) {
      Object.entries(error.data?.zodError?.fieldErrors).forEach(
        ([key, errors]: [key: string, errors: unknown]) => {
          receivedFeedback = true
          handlers.fields(key, (errors as string[])[0] as string)
        }
      )
      if (error.data?.zodError?.formErrors?.length > 0) receivedFeedback = true
      handlers.form(error.data?.zodError?.formErrors[0])
    }
  }
  // if there is no `fieldErrors` or `formErrors` then the user has not got any feedback yet, show `message`
  if (!receivedFeedback) handlers.default(message)
}
