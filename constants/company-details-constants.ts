import { Briefcase, Clock, Edit, Plus } from 'lucide-react'

// Sample data structure for Company Details
export const companyDetailsData = {
  logo: '/logo.svg', // This would be the actual logo URL
  companyName: 'Flowfull',
  foundedOn: '2023',
  websiteUrl: 'https://flowfull.com',
  inHousePartnershipTeam: 'Yes',
  sharkdomPersonalisedUrl: 'https://sharkdom.com/flowfull',
  aboutCompany: 'Premier digital planner for centralizing tasks',
  aboutProductService:
    "Flowfull is a premier digital planner and calendar for centralising tasks, unifying schedules, and optimising productivity. Experience the world's #1 time-blocking app."
}

// Sample data structure for Time Zone
export const timeZoneData = {
  timezone: '(UTC+05:30) Asia/Calcutta',
  dateTimeFormat: '25 Sep 2025 | 00:00 Hrs'
}

// Timezone options
export const timezoneOptions = [
  {
    value: '(UTC-12:00) International Date Line West',
    label: '(UTC-12:00) International Date Line West'
  },
  {
    value: '(UTC-11:00) Midway Island, Samoa',
    label: '(UTC-11:00) Midway Island, Samoa'
  },
  { value: '(UTC-10:00) Hawaii', label: '(UTC-10:00) Hawaii' },
  { value: '(UTC-09:00) Alaska', label: '(UTC-09:00) Alaska' },
  {
    value: '(UTC-08:00) Pacific Time (US & Canada)',
    label: '(UTC-08:00) Pacific Time (US & Canada)'
  },
  {
    value: '(UTC-07:00) Mountain Time (US & Canada)',
    label: '(UTC-07:00) Mountain Time (US & Canada)'
  },
  {
    value: '(UTC-06:00) Central Time (US & Canada)',
    label: '(UTC-06:00) Central Time (US & Canada)'
  },
  {
    value: '(UTC-05:00) Eastern Time (US & Canada)',
    label: '(UTC-05:00) Eastern Time (US & Canada)'
  },
  {
    value: '(UTC-04:00) Atlantic Time (Canada)',
    label: '(UTC-04:00) Atlantic Time (Canada)'
  },
  { value: '(UTC-03:00) Brasilia', label: '(UTC-03:00) Brasilia' },
  { value: '(UTC-02:00) Mid-Atlantic', label: '(UTC-02:00) Mid-Atlantic' },
  { value: '(UTC-01:00) Azores', label: '(UTC-01:00) Azores' },
  {
    value: '(UTC+00:00) Greenwich Mean Time',
    label: '(UTC+00:00) Greenwich Mean Time'
  },
  {
    value: '(UTC+01:00) Amsterdam, Berlin, Rome',
    label: '(UTC+01:00) Amsterdam, Berlin, Rome'
  },
  {
    value: '(UTC+02:00) Athens, Bucharest, Istanbul',
    label: '(UTC+02:00) Athens, Bucharest, Istanbul'
  },
  {
    value: '(UTC+03:00) Moscow, St. Petersburg',
    label: '(UTC+03:00) Moscow, St. Petersburg'
  },
  {
    value: '(UTC+04:00) Abu Dhabi, Muscat',
    label: '(UTC+04:00) Abu Dhabi, Muscat'
  },
  {
    value: '(UTC+05:00) Islamabad, Karachi, Tashkent',
    label: '(UTC+05:00) Islamabad, Karachi, Tashkent'
  },
  { value: '(UTC+05:30) Asia/Calcutta', label: '(UTC+05:30) Asia/Calcutta' },
  { value: '(UTC+06:00) Almaty, Dhaka', label: '(UTC+06:00) Almaty, Dhaka' },
  {
    value: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
    label: '(UTC+07:00) Bangkok, Hanoi, Jakarta'
  },
  {
    value: '(UTC+08:00) Beijing, Chongqing, Hong Kong',
    label: '(UTC+08:00) Beijing, Chongqing, Hong Kong'
  },
  {
    value: '(UTC+09:00) Osaka, Sapporo, Tokyo',
    label: '(UTC+09:00) Osaka, Sapporo, Tokyo'
  },
  {
    value: '(UTC+10:00) Brisbane, Canberra, Melbourne',
    label: '(UTC+10:00) Brisbane, Canberra, Melbourne'
  },
  {
    value: '(UTC+11:00) Magadan, Solomon Islands',
    label: '(UTC+11:00) Magadan, Solomon Islands'
  },
  {
    value: '(UTC+12:00) Auckland, Wellington',
    label: '(UTC+12:00) Auckland, Wellington'
  }
]

// Date & Time Format options
export const dateTimeFormatOptions = [
  { value: '25 Sep 2025 | 00:00 Hrs', label: '25 Sep 2025 | 00:00 Hrs' },
  { value: 'Sep 25, 2025 | 12:00 AM', label: 'Sep 25, 2025 | 12:00 AM' },
  { value: '2025-09-25 | 00:00', label: '2025-09-25 | 00:00' },
  { value: '25/09/2025 | 00:00', label: '25/09/2025 | 00:00' },
  { value: '09/25/2025 | 12:00 AM', label: '09/25/2025 | 12:00 AM' }
]

// Color constants matching existing design system
export const colors = {
  text: '#2A3241',
  textLight: '#6B7280',
  primary: '#6863FB',
  background: '#FFFFFF',
  border: '#E5E7EB',
  hover: '#F9FAFB',
  link: '#3B82F6'
}

// Icons
export const icons = {
  Briefcase,
  Clock,
  Edit,
  Plus
}
