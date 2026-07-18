const MarketSegmentChart = ({
  data
}: {
  data: { key: string; percentage: number }[]
}) => {
  const colors = [
    'rgb(16, 54, 111)',
    'rgb(131, 196, 19)',
    'rgb(12, 176, 247)',
    'rgb(0, 98, 241)',
    'rgb(252, 170, 63)',
    'rgb(252, 54, 47)'
  ]

  const chartData = data?.map((item, index) => ({
    label: item.key,
    percentage: item.percentage.toFixed(1),
    color: colors[index % colors.length]
  }))

  const Chart = () => (
    <div className='flex h-8 w-full rounded-lg'>
      {chartData?.map((segment, index) => (
        <div
          key={index}
          style={{
            width: `${segment.percentage}%`,
            backgroundColor: segment.color
          }}
          className={`h-full ${index === 0 ? 'rounded-l-lg' : ''} ${
            index === chartData.length - 1 ? 'rounded-r-lg' : ''
          }`}
          title={`${segment.label}: ${segment.percentage}%`}
        />
      ))}
    </div>
  )

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-text-20 p-5'>
      <h4 className='text-lg font-bold leading-[22px] text-text-100'>
        Market Segment
      </h4>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-3 gap-x-8 gap-y-6'>
          {chartData?.slice(0, 3).map((segment, index) => (
            <div key={index} className='mb-2 flex flex-col gap-0.5 text-sm'>
              <div className='flex items-center gap-1.5'>
                <span
                  className='inline-block h-3 w-3 rounded-full'
                  style={{
                    backgroundColor: segment.color
                  }}
                />{' '}
                <span className='text-sm font-medium leading-4 text-text-80'>
                  {segment.label}
                </span>
              </div>
              <div>
                <span className='text-xl font-bold leading-6 text-text-100'>
                  {segment.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Chart />
        </div>

        <div className='grid grid-cols-3 gap-x-8 gap-y-6'>
          {chartData?.slice(3).map((segment, index) => (
            <div key={index} className='mb-2 flex flex-col gap-0.5 text-sm'>
              <div className='flex items-center gap-1.5'>
                <span
                  className='inline-block h-3 w-3 rounded-full'
                  style={{
                    backgroundColor: segment.color
                  }}
                />{' '}
                <span className='text-sm font-medium leading-4 text-text-80'>
                  {segment.label}
                </span>
              </div>
              <div>
                <span className='text-xl font-bold leading-6 text-text-100'>
                  {segment.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketSegmentChart
