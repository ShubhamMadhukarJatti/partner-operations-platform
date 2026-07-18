import React from 'react'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = () => {
  const data = {
    labels: ['Tech', 'Finance', 'Marketing', 'Education', 'Others'],
    datasets: [
      {
        label: 'Sector of company',
        data: [22, 25, 9, 16, 28],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide the default legend
      },
      tooltip: {
        enabled: true
      }
    },
    cutout: '70%'
  }

  return (
    <div className='flex w-full items-center justify-between p-5'>
      <div className='h-64 w-1/2 max-w-xs'>
        <Doughnut data={data} options={options} />
      </div>
      <div className='w-1/2 pl-8'>
        {data.labels.map((label, index) => (
          <div key={index} className='mb-2 flex items-center text-xs'>
            <span
              className='mr-2 inline-block h-4 w-4 rounded-full'
              style={{
                backgroundColor: data.datasets[0].backgroundColor[index]
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoughnutChart
