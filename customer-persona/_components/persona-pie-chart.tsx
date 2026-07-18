import React from 'react'
import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  Tooltip
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController)

const PersonaPieChart = ({ data: chartData }: { data: any }) => {
  const data = {
    labels: chartData?.map((item: any) => item.key),
    datasets: [
      {
        data: chartData?.map((item: any) => item.percentage.toFixed(2)),
        backgroundColor: [
          'rgb(16, 54, 111)',
          'rgb(131, 196, 19)',
          'rgb(12, 176, 247)',
          'rgb(0, 98, 241)',
          'rgb(252, 170, 63)',
          'rgb(252, 54, 47)'
        ],
        borderColor: '#ffffff',
        borderWidth: 0
      }
    ]
  }

  const options = {
    cutout: '80%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        // callbacks: {
        //   label: (context: {
        //     label?: string
        //     parsed?: number
        //     dataset: { data: number[] }
        //   }) => {
        //     const label = context.label || ''
        //     const value = context.parsed || 0
        //     const total = context.dataset.data.reduce((a, b) => a + b, 0)
        //     const percentage = ((value / total) * 100).toFixed(1)
        //     return `${label} (${percentage}%)`
        //   }
        // }
      }
    },
    layout: {
      padding: 0
    }
  }

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-text-20 p-5'>
      <h4 className='text-lg font-bold leading-[22px] text-text-100'>
        Sector Of Company
      </h4>
      <div className='flex items-center justify-center gap-8'>
        <div className='relative h-[12.6875rem] w-[12.6875rem]'>
          <Doughnut data={data} options={options} />
        </div>

        <div className='grid grid-cols-2 gap-x-8 gap-y-6'>
          {data?.labels?.map((label: string, index: number) => {
            const value = data.datasets[0].data[index]

            return (
              <div key={index} className='mb-2 flex flex-col gap-0.5 text-sm'>
                <div>
                  <span className='text-sm font-medium leading-4 text-text-80'>
                    {label}
                  </span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <span
                    className='inline-block h-3 w-3 rounded-full'
                    style={{
                      backgroundColor: data.datasets[0].backgroundColor[index]
                    }}
                  />
                  <span className='text-xl font-bold leading-6 text-text-100'>
                    {value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PersonaPieChart
