import { SPREADSHEET_URL_REGEX } from '../constants'

export const getSpreadsheetIdFromURL = (url: string) => {
  return (SPREADSHEET_URL_REGEX.exec(url) as RegExpExecArray)[1]
}
