type Props = {
  percent: number
}
const radius = 30

export const CircularProgress = ({ percent }: Props) => {
  const circumference = Math.PI * 2 * radius
  const c = radius + 10

  return (
    <div className='inline-flex items-center justify-center'>
      <svg className='h-20 w-20 -rotate-90 transform'>
        <circle
          className='text-gray-300'
          strokeWidth={5}
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={c}
          cy={c}
        />
        <circle
          className='text-primary'
          strokeWidth={5}
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
      <span className='absolute text-lg text-primary'>{percent}%</span>
    </div>
  )
}
