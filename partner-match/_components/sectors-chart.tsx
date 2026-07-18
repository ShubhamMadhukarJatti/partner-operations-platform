'use client'

interface SectorData {
  key: string
  percentage: number
}

interface SectorDistributionProps {
  data: SectorData[]
}

export default function SectorDistribution({ data }: SectorDistributionProps) {
  // Find the highest percentage
  const highestPercentage = data
    ? Math.max(...data.map((item) => item.percentage))
    : 0

  // Function to round percentage
  const roundPercentage = (value: number) => Math.round(value)

  return (
    <div className='w-full  rounded-lg border border-border bg-white p-6'>
      <div className='mb-6 flex items-start justify-between'>
        <h2 className='text-shark-lg font-semibold text-text-100'>
          Sector Distribution
        </h2>
      </div>

      <div className='mb-8'>
        <div className='text-4xl font-bold'>
          {roundPercentage(highestPercentage)}%
        </div>
      </div>

      <div className='space-y-6'>
        {data?.map((sector) => (
          <div key={sector.key} className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>{sector.key}</span>
              <span className='text-gray-600'>
                {roundPercentage(sector.percentage)}%
              </span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
              <div
                className='h-full rounded-full bg-blue-500'
                style={{ width: `${sector.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
