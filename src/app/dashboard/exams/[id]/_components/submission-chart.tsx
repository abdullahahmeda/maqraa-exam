'use client'

import { format } from 'date-fns'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts'

type Element = {
  submittedAt: Date | null
  total: string | number | bigint
}

export const SubmissionChart = ({ data }: { data: Element[] }) => {
  return (
    <ResponsiveContainer height={300}>
      <LineChart data={data} height={300}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey={(obj: Element) => format(obj.submittedAt!, 'dd/MM/yyyy')}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='total' stroke='#82ca9d' />
      </LineChart>
    </ResponsiveContainer>
  )
}
