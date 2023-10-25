import { z } from 'zod'

export const exportSystemExamsSchema = z.object({ cycleId: z.string().min(1) })
