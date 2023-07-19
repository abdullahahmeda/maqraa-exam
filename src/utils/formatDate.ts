import dayjs from 'dayjs'

export const formatDate = (date: Date) =>
  dayjs(date).format('DD MMMM YYYY hh:mm A')
