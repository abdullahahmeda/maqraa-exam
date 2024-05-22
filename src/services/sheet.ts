import { google } from 'googleapis'
import XLSX from 'xlsx'
import { z } from 'zod'
import { env } from '~/env.js'

const sheets = google.sheets({
  version: 'v4',
  auth: env.GOOGLE_API_KEY,
})

export function exportSheet<T>(data: T[], mapper: (element: T) => object) {
  const worksheet = XLSX.utils.json_to_sheet(data.map((q) => mapper(q)))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  const buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  }) as Buffer
  return Uint8Array.from(buffer)
}

export async function getGoogleSheetsNames(spreadsheetId: string) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  })

  return response.data.sheets?.map(
    (sheet) => sheet.properties?.title,
  ) as string[]
}

export async function getRowsFromSheet(
  spreadsheetId: string,
  sheetName: string,
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'${sheetName}'!A:R`,
  })

  return response.data.values!
}

export async function importFromGoogleSheet<Z extends z.ZodType>({
  spreadsheetId,
  sheetName,
  mapper,
  validationSchema,
}: {
  spreadsheetId: string
  sheetName: string
  mapper: (row: unknown[]) => unknown
  validationSchema: Z
}) {
  const rows = await getRowsFromSheet(spreadsheetId, sheetName)
  const results: z.infer<Z>[] = []
  for (const [i, row] of rows.entries()) {
    if (i === 0) continue // ignore headers
    const mappedRow = mapper(row)
    results.push(
      validationSchema.parse(mappedRow, { path: [i + 1] }) as z.infer<Z>,
    )
  }

  return results
}
