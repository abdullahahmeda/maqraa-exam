type Props = {
  percent: number
}
const radius = 40

export const CircularProgress = ({ percent }: Props) => {
  const circumference = Math.PI * 2 * radius
  const c = radius + 10

  return (
    <div className='inline-flex items-center justify-center'>
      <svg className='h-24 w-24 -rotate-90 transform'>
        <circle
          className='text-gray-300'
          strokeWidth={10}
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={c}
          cy={c}
        />
        <circle
          className='text-primary'
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percent / 100) * circumference}
          strokeLinecap='round'
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={c}
          cy={c}
        />
      </svg>
      <span className='absolute text-lg text-primary'>
        {percent.toFixed(1)}%
      </span>
    </div>
  )
}
