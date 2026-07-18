import React from 'react'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ActivePartnershipChartProps {
  active: number
  inactive: number
}

const ActivePartnershipChart: React.FC<ActivePartnershipChartProps> = ({
  active,
  inactive
}) => {
  const data = {
    labels: [`Active (${active})`, `Inactive (${inactive})`],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ['#0062F1', '#FC362F'],
        borderColor: ['#3b82f6', '#ef4444'],
        borderWidth: 0,
        borderRadius: 5
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            )
            const percentage = ((value / total) * 100).toFixed(0)
            return `${label}: ${percentage}%`
          }
        }
      }
    }
  }

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-text-20 p-5'>
      <h4 className='text-lg font-bold leading-[22px] text-text-100'>
        Activated partnership
      </h4>
      <div className='flex items-center justify-center gap-8'>
        <div className='relative h-[173.69px] w-[368.79px]'>
          <Doughnut data={data} options={options} />
          <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center'>
            <span className='text-3xl font-bold'>{`${((active / (active + inactive)) * 100).toFixed(0)}%`}</span>
            <span className='text-sm font-medium text-text-80'>
              Active Partnerships
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {data.labels.map(
            (
              label:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined,
              index: number
            ) => {
              const value = data.datasets[0].data[index]
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return (
                <div key={index} className='mb-2 flex flex-col gap-0.5 text-sm'>
                  <div>
                    <span className='text-sm font-medium leading-4 text-text-80'>
                      {label}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span
                      className=' inline-block h-3 w-3 rounded-full'
                      style={{
                        backgroundColor: data.datasets[0].backgroundColor[index]
                      }}
                    />
                    <span className='text-xl font-bold leading-6 text-text-100'>
                      {value.toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivePartnershipChart
