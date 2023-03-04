import { google } from 'googleapis'
import { SPREADSHEET_URL_REGEX } from '../constants'
import { env } from '../env.mjs'

const sheets = google.sheets({
  version: 'v4',
  auth: env.GOOGLE_API_KEY
})

export const getSpreadsheetIdFromURL = (url: string) => {
  return (SPREADSHEET_URL_REGEX.exec(url) as RegExpExecArray)[1]
}

export default sheets
