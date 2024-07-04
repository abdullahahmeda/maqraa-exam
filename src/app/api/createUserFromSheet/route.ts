import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { db } from '~/server/db'
import { sendMail } from '~/utils/email'
// import { hashPassword } from '~/utils/server/password'
import { getBaseUrl } from '~/utils/getBaseUrl'
import { generateRandomPassword } from '~/utils/strings'
import { env } from '~/env'
import { z } from 'zod'

async function handler(req: Request) {
  const schema = z.object({
    email: z.string().min(1).trim().toLowerCase().email(),
    name: z.string().min(1),
    phone: z.string().optional(),
    courseName: z.string().min(1),
    trackName: z.string().min(1),
    curriculumName: z.string().min(1),
    cycleId: z.string().min(1),
  })

  const body = schema.parse(await req.json())

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
      const password = generateRandomPassword()
      const hashedPassword = '12345' // hashPassword(password)
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
  return Response.json({ success: true })
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const POST =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  env.NODE_ENV === 'development' ? handler : verifySignatureAppRouter(handler)
