import { z } from 'zod'

export const paginationSchema = z.object({
  pageIndex: z.number().int().safe().finite().min(0),
  pageSize: z.number().int().safe().finite().positive(),
})

export type PaginationSchema = z.infer<typeof paginationSchema>
