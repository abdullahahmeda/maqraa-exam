import { RowData } from '@tanstack/react-table'
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData> {
    textAlign?: 'left' | 'center' | 'right'
    thClassName?: string
    tdClassName?: string
  }
}
