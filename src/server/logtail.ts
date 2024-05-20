import { Logtail } from '@logtail/node'
import { env } from '../env.js'

export const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN)
