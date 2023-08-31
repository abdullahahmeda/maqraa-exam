import { format } from 'date-fns'
import { arSA } from 'date-fns/locale'

export const formatDate = (date: Date) =>
  format(date, 'dd MMMM yyyy hh:mm a', {
    locale: arSA,
  })
