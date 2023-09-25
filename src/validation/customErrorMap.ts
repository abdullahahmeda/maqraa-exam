import { z } from 'zod'

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'number') return { message: 'هذا المدخل ليس رقم' }
    if (issue.expected === 'integer')
      return { message: 'هذا المدخل ليس رقم صحيح' }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      if (issue.minimum === 1) return { message: `هذا الحقل إجباري` }
      return {
        message: `هذا الحقل يجب أن يكون ${issue.minimum} حروف على الأقل`,
      }
    }
    if (issue.type === 'number') {
      return {
        message: `أقل قيمة مسموحة لهذا الحقل هي ${
          (issue.minimum as number) + Number(!issue.inclusive)
        }`,
      }
    }
  }
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email')
      return {
        message: 'بريد الكتروني غير صالح',
      }
  }
  // if (issue.code === _z.ZodIssueCode.invalid_union) {
  //   issue.unionErrors.map(error =>)
  // }
  // console.log('issue', issue)
  // console.log('ctx', ctx)
  return { message: ctx.defaultError }
}
