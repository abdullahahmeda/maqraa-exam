import type { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature } from '@upstash/qstash/dist/nextjs'
import { db } from '~/server/db'
import { generate as generatePassword } from 'generate-password'
import bcrypt from 'bcryptjs'
import { sendMail } from '~/utils/email'
import { getBaseUrl } from '~/utils/api'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: {
    email: string
    name: string
    phone: string
    courseName: string
    trackName: string
    curriculumName: string
    cycleId: string
  } = req.body

  let user = await db
    .selectFrom('User')
    .select('id')
    .where('email', '=', body.email)
    .executeTakeFirst()
  let course = await db
    .selectFrom('Course')
    .select('id')
    .where('name', '=', body.courseName)
    .executeTakeFirst()
  let track = course
    ? await db
        .selectFrom('Track')
        .select('id')
        .where('name', '=', body.trackName)
        .where('courseId', '=', course.id)
        .executeTakeFirst()
    : undefined
  let curriculum = track
    ? await db
        .selectFrom('Curriculum')
        .select('id')
        .where('name', '=', body.curriculumName)
        .where('trackId', '=', track.id)
        .executeTakeFirst()
    : undefined

  await db.transaction().execute(async (trx) => {
    if (!user) {
      const password = generatePassword()
      const hashedPassword = bcrypt.hashSync(password)
      user = await trx
        .insertInto('User')
        .values({
          email: body.email,
          name: body.name,
          password: hashedPassword,
          role: 'STUDENT',
          phone: body.phone,
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      await sendMail({
        subject: 'تم إضافة حسابك في المقرأة!',
        to: [{ email: body.email }],
        textContent: `كلمة المرور الخاصة بك في المقرأة هي: ${password}\nيمكنك تسجيل الدخول عن طريق الرابط: ${getBaseUrl()}`,
      })
    }
    if (!course)
      course = await trx
        .insertInto('Course')
        .values({
          name: body.courseName,
        })
        .returning('id')
        .executeTakeFirstOrThrow()

    if (!track)
      track = await trx
        .insertInto('Track')
        .values({
          name: body.trackName,
          courseId: course.id,
        })
        .returning('id')
        .executeTakeFirstOrThrow()

    if (!curriculum)
      curriculum = await trx
        .insertInto('Curriculum')
        .values({
          name: body.curriculumName,
          trackId: track.id,
        })
        .returning('id')
        .executeTakeFirstOrThrow()

    await trx
      .insertInto('UserCycle')
      .values({
        cycleId: body.cycleId,
        curriculumId: curriculum.id,
        userId: user.id,
      })
      .execute()
  })
  res.json({ ok: true })
}

export default verifySignature(handler)

export const config = {
  api: {
    bodyParser: false,
  },
}
