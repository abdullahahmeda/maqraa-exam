import nc from 'next-connect'
import { env } from '~/env.mjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '~/server/auth'
import { logErrorToLogtail } from '~/utils/logtail'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  //
})

export default handler
