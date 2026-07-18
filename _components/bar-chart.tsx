// import {
//   BarElement,
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip
// } from 'chart.js'
// import ChartDataLabels from 'chartjs-plugin-datalabels'
// import { Bar } from 'react-chartjs-2'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// const BarChart = ({ data: chartData }: { data: any }) => {
//   const data = {
//     labels: chartData?.map(
//       (item: { percentage: number; type: string }) => item.type
//     ),
//     datasets: [
//       {
//         data: chartData?.map(
//           (item: { percentage: number; type: string }) => item.percentage
//         ),
//         backgroundColor: [
//           '#31AE90',
//           '#3178AE',
//           '#3D31AE',
//           '#6731AE',
//           '#AE31A1',
//           '#AE3139'
//         ],
//         borderWidth: 0
//       }
//     ]
//   }

//   const options = {
//     responsive: true,
//     plugins: {
//       datalabels: {
//         display: true,
//         color: 'black',
//         formatter: Math.round,
//         anchor: 'end',
//         offset: -20,
//         align: 'start'
//       },
//       legend: {
//         display: false
//       },
//       title: {
//         display: true,
//         text: 'Partnership Types',
//         position: 'bottom'
//       }
//     },
//     layout: {
//       padding: {
//         top: 20
//       }
//     },
//     scales: {
//       x: {
//         display: false, // Hide the x-axis
//         grid: {
//           display: false // Hide x-axis grid lines
//         }
//       },
//       y: {
//         display: false, // Hide the y-axis
//         grid: {
//           display: true // Hide y-axis grid lines
//         }
//       }
//     }
//   }

//   return (
//     <Bar data={data} options={options as any} plugins={[ChartDataLabels]} />
//   )
// }

// export default BarChart

import React from 'react'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const CompabilityChart: React.FC<any> = ({
  data: chartData
}: {
  data: any
}) => {
  const data = {
    labels: chartData?.map(
      (item: { percentage: number; type: string }) => item.type
    ),
    datasets: [
      {
        data: chartData?.map(
          (item: { percentage: number; type: string }) => item.percentage
        ),
        backgroundColor: [
          '#31AE90',
          '#3178AE',
          '#3D31AE',
          '#6731AE',
          '#AE31A1',
          '#AE3139'
        ],

        borderWidth: 0,
        borderRadius: 0
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
    <div className='relative w-full'>
      <Doughnut data={data} options={options} />
      <div className='absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center'>
        <span className='text-shark-xl font-bold text-text-100'>{`100%`}</span>
        <span className='w-full text-center text-shark-xs font-medium text-text-80'>
          Partnership Types
        </span>
      </div>
    </div>
  )
}

export default CompabilityChart
