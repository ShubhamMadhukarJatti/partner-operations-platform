import { CollaborationType, OrganizationType } from '@/types'
import { useMediaQuery } from '@react-hookz/web'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mou } from '@/app/(app)/(dashboard-pages)/dashboard/mou'
import { Sign } from '@/app/(app)/(dashboard-pages)/dashboard/sign'

type Props = {
  currentOrganization: OrganizationType
  partnerOrganization: OrganizationType
  proposal: CollaborationType
  type: 'sent' | 'recieved'
}

export const SignMou = ({
  currentOrganization,
  partnerOrganization,
  proposal,
  type
}: Props) => {
  const sender = type === 'sent' ? currentOrganization : partnerOrganization
  const reciever = type === 'sent' ? partnerOrganization : currentOrganization

  const isDesktop = useMediaQuery('(min-width: 768px)', {
    initializeWithValue: false
  })
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Sign MOU</Button>
        </DialogTrigger>
        <DialogContent className='max-h-[90%] max-w-[90%] overflow-auto xl:max-w-screen-lg'>
          <Mou sender={sender} reciever={reciever} proposal={proposal} />
          <Sign organizationId={sender.id} />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Sign MOU</Button>
      </DrawerTrigger>
      <DrawerContent className='h-[98dvh]'>
        <ScrollArea className='overflow-auto p-2'>
          <Mou sender={sender} reciever={reciever} proposal={proposal} />
          <Sign organizationId={sender.id} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
