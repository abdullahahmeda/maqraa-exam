import { google } from 'googleapis'
import { SPREADSHEET_URL_REGEX } from '../constants'
import { env } from '../env.mjs'

const sheets = google.sheets({
  version: 'v4',
  auth: env.GOOGLE_API_KEY,
})

export const getSpreadsheetIdFromURL = (url: string) => {
  return (SPREADSHEET_URL_REGEX.exec(url) as RegExpExecArray)[1]
}

export const getFields = async (spreadsheetId: string, sheet: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'${sheet}'!A:R`,
  })

  return response.data.values as string[][]
}

export const getSheets = async (spreadsheetId: string) => {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  })

  return response.data.sheets?.map(
    (sheet) => sheet.properties?.title
  ) as string[]
}

// export default sheets
