import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { format, parseISO } from 'date-fns'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type ImpressionData = { count: number; date: string }
type LeadDetails = {
  name: string
  email: string
}
type LeadData = {
  date: string
  details: LeadDetails[]
}
interface AnalyticsDataProps {
  analyticsData: {
    referralCode: string
    organizationId: number
    impressions: ImpressionData[]
    leads: LeadData[]
  }
}

export const AnalyticsChart = ({ analyticsData }: AnalyticsDataProps) => {
  // Ensure the properties are arrays
  const impressions = analyticsData?.impressions || []
  const leads = analyticsData?.leads || []
  // Extract dates and counts for impressions
  const impressionDates = impressions?.map((impression) =>
    format(parseISO(impression?.date), 'yyyy-MM-dd')
  )
  const impressionCounts = impressions?.map((impression) => impression?.count)

  // Extract dates and counts for leads
  const leadDates = leads?.map((lead) =>
    format(parseISO(lead?.date), 'yyyy-MM-dd')
  )
  const leadCounts = leads?.map((lead) => lead?.details?.length)

  // Combine dates for labels (unique sorted dates)
  const allDates = Array.from(
    new Set([...impressionDates, ...leadDates])
  ).sort()

  // Prepare data for the chart
  const data = {
    labels: allDates,
    datasets: [
      {
        label: 'Impressions',
        data: allDates?.map((date) =>
          impressionDates?.includes(date)
            ? impressionCounts[impressionDates?.indexOf(date)]
            : 0
        ),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false
      },
      {
        label: 'Leads',
        data: allDates?.map((date) =>
          leadDates?.includes(date) ? leadCounts[leadDates?.indexOf(date)] : 0
        ),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Referral Analytics'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        },
        beginAtZero: true
      }
    }
  }

  return <Line data={data} options={options} />
}
