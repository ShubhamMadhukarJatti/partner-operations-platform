import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const predefinedOrder = [
  'Small Enterprises',
  'Medium Enterprises',
  'Large Enterprises'
]

const CompanySizeChart = ({ currentPersona }: any) => {
  const data = {
    labels: ['Small', 'Mid', 'Large'], // Categories for size
    datasets: [
      {
        label: 'My Org',
        data: predefinedOrder?.map((key) => {
          const item = currentPersona?.find((item: any) => item.key === key)
          return item ? item.percentage : 0 // Default to 0 if the key is not found
        }),
        backgroundColor: '#83C41380',
        borderRadius: 4
      }
    ]
  }

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: false,
        text: 'Company Size Comparison (Small, Mid, Large)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: false,
          text: 'Percentage (%)'
        },
        grid: {
          display: true,
          color: '#E4E7EE'
        },
        ticks: {
          color: '#4D5C78', // Custom label color
          font: {
            size: 12, // Custom font size for labels
            weight: 'bold'
          }
        }
      },
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: false,
          text: 'Percentage (%)'
        },
        grid: {
          display: false // Hide Y-axis grid lines
        },
        ticks: {
          color: '#4D5C78', // Custom label color
          font: {
            size: 10, // Custom font size for labels
            weight: 'bold'
          }
        }
      }
    }
  }

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-text-20 '>
      <h4 className='p-5 text-lg font-bold leading-[22px] text-text-100'>
        Size of Company
      </h4>
      <div className='flex h-[192px] w-full items-center justify-center'>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default CompanySizeChart
