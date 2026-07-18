import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { ImageFallback } from '@/components/shared/image-with-fallback'

type Props = {
  index: number
}

export const ResourceCard = ({ index }: Props) => {
  return (
    <Card className='flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-white p-2 shadow-lg'>
      <ImageFallback
        src={
          index == 0
            ? `/images/dashboard/resource.png`
            : index == 1
              ? `/images/dashboard/resource_1.png`
              : `/images/dashboard/resource_2.png`
        }
        width={515}
        height={275}
        className='h-auto w-full rounded-xl object-cover'
      />

      <CardFooter className='justify-end'>
        <Button className=''>Read More</Button>
      </CardFooter>
    </Card>
  )
}
