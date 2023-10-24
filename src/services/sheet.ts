import XLSX from 'xlsx'

export const exportSheet = <T>(data: T[], mapper: (element: T) => object) => {
  const worksheet = XLSX.utils.json_to_sheet(data.map((q) => mapper(q)))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  const buffer: Buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  })
  return Uint8Array.from(buffer)
}
