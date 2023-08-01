import axios from 'axios'
import { env } from '../env.mjs'

type SendMailOptions = {
  to: { email: string; name?: string }[]
  sender?: { email: string; name?: string }
  subject: string
  textContent?: string
  htmlContent?: string
}

export const sendMail = async (mailOptions: SendMailOptions) => {
  if (!mailOptions.sender)
    mailOptions.sender = {
      name: 'Abdulah Ahmed',
      email: 'abdullah.ahmed.a2000@gmail.com'
    }

  return axios.post('https://api.brevo.com/v3/smtp/email', mailOptions, {
    headers: {
      'api-key': env.SENDINBLUE_API_KEY
    }
  })
}
