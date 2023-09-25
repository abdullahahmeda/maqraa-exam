import { env } from '../env.mjs'
import { createTransport } from 'nodemailer'

const transport = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
})

type SendMailOptions = {
  to: { email: string; name?: string }[]
  sender?: { email: string; name?: string }
  subject: string
  textContent?: string
  htmlContent?: string
}

export const sendMail = async (mailOptions: SendMailOptions) => {
  return transport.sendMail({
    from: `Maqraa <${env.SMTP_EMAIL}>`,
    text: mailOptions.textContent,
    html: mailOptions.htmlContent,
    subject: mailOptions.subject,
    to: mailOptions.to.map((receiver) => receiver.email).join(','),
  })
}

export const sendPasswordChangedEmail = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return sendMail({
    subject: 'تم تغيير كلمة المرور الخاصة بك',
    to: [{ email }],
    textContent: `كلمة المرور الجديدة الخاصة بك ${password}`,
  })
}
