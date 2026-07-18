import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'

const ProposalSent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Shoutout sent</Button>
      </DialogTrigger>
      <DialogContent className='flex w-[472px] flex-col items-center pt-16'>
        <Image
          alt='shoutout-request-sent'
          src={'/assets/Mail.svg'}
          height={250}
          width={250}
        ></Image>
        <h1 className='text-center text-2xl font-semibold text-[#101828]'>
          Proposal sent!
        </h1>
        <p className='py-2 text-center text-base leading-5 text-[#475467]'>
          Proposal sent to
          {'Zomato'} successfully. Zomato typically responds within 18 hours.
          You will be notified via email once they respond.
        </p>
      </DialogContent>
      <DialogFooter className='mt-9 w-full'>
        <Button>Next</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default ProposalSent
