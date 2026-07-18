import { PieChart } from 'lucide-react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  return (
    <main className='space-y-4 p-4'>
      <Heading icon={<PieChart size={24} />} title='Partnership Dashboard' />

      <section className='grid w-full grid-cols-[repeat(auto-fit,_minmax(min(100%,_23rem),_1fr))] place-items-center gap-4'>
        {[...Array(3)].map((_, i) => {
          return <LoadingCard key={i} />
        })}
      </section>
    </main>
  )
}

export const LoadingCard = () => {
  return (
    <Card className='flex h-full w-full flex-col gap-2'>
      <CardContent className='flex flex-1 flex-col gap-2 overflow-hidden'>
        <div className='flex items-center justify-between'>
          <Skeleton className='size-16 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
        </div>

        <Skeleton className='h-7 w-1/2' />
        <div className='flex flex-col gap-0.5'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Skeleton className='h-9 w-24 rounded-lg' />
      </CardFooter>
    </Card>
  )
}
