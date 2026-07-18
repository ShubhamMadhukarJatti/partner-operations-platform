import { Activity } from './types'

interface ActivityItemProps {
  activity: Activity
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className='flex gap-3'>
      <img
        src={activity.user.avatar}
        alt={activity.user.name}
        className='h-8 w-8 flex-shrink-0 rounded-full'
      />
      <div className='flex-1'>
        <div className='text-sm text-text-70'>
          <span className='font-medium'>{activity.user.name}</span>
          <span className='ml-1'>{activity.description}</span>
          <span className='ml-2 text-text-50'>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  )
}
