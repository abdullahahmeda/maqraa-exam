import { z } from 'zod'

export const errorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === 'undefined') return { message: 'هذا الحقل إجباري' }
    if (issue.expected === 'number') return { message: 'هذا المدخل ليس رقم' }
    if (issue.expected === 'integer')
      return { message: 'هذا المدخل ليس رقم صحيح' }
    return { message: 'قيمة غير صالحة' }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    const minimum = (issue.minimum as number) + 1 - Number(issue.inclusive)
    if (issue.type === 'string') {
      if (issue.minimum === 1) return { message: `هذا الحقل إجباري` }
      return {
        message: `هذا الحقل يجب أن يكون ${minimum} حروف على الأقل`,
      }
    }
    if (issue.type === 'number') {
      return {
        message: `أقل قيمة مسموحة لهذا الحقل هي ${minimum}`,
      }
    }
  }
  if (issue.code === z.ZodIssueCode.not_finite)
    return { message: 'القيمة يجب أن تكون رقم محدد' }
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email')
      return {
        message: 'بريد الكتروني غير صالح',
      }
  } else if (issue.code === z.ZodIssueCode.too_big) {
    const maximum = (issue.maximum as number) - 1 + Number(issue.inclusive)
    return { message: `أكبر قيمة مسموحة هي ${maximum}` }
  }
  console.log(issue)
  return { message: 'قيمة غير صالحة' }
  return { message: ctx.defaultError }
}
