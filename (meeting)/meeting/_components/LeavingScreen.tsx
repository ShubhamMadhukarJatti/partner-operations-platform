import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function LeaveScreen({
  setIsMeetingLeft
}: {
  setIsMeetingLeft: (arg: boolean) => void
}) {
  return (
    <div className='flex  h-full flex-1 flex-col items-center  justify-center '>
      <h1 className='text-3xl font-light'>Sharkdom x Zomato</h1>
      <div className=' mt-7 flex min-w-[30rem] flex-col items-center  gap-3 rounded-xl bg-white  px-9 pb-10 pt-6 drop-shadow-md'>
        <p className=' pb-7 text-2xl font-medium'>You left the meeting</p>
        <Link href={'/dashboard'} className='w-full'>
          <Button className='w-full  py-4 font-semibold '>
            Go to dashboard
          </Button>
        </Link>
        <Button
          className='w-full border-2 border-[#1D2939] py-4 font-semibold '
          onClick={() => {
            setIsMeetingLeft(false)
          }}
          variant={'outline'}
        >
          Rejoin the Meeting
        </Button>
      </div>
    </div>
  )
}
