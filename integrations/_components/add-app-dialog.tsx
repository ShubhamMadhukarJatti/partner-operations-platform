import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

import { buildHubSpotOAuthUrl } from '@/lib/crm-oauth'
import { getZohoAccountsBase } from '@/lib/zoho'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import IntegrationCard from './integration-card'

const NewAppDialog = () => {
  const router = useRouter()

  const handleHubSpotCardClick = () => {
    const redirectUri = `${window.location.origin}/integrations`
    const authUrl = buildHubSpotOAuthUrl({
      redirectUri,
      source: 'integrations-add-app-dialog'
    })
    window.open(authUrl)
  }

  const handleZohoCardClick = () => {
    const zohoId =
      (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string)
        ?.trim()
        .replace(/\+/g, '') ?? ''
    const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
    const zohoScopes = process.env.NEXT_PUBLIC_ZOHO_SCOPES as string as string
    const zohoEnvState = process.env.NEXT_PUBLIC_ZOHO_STATE as string as string

    console.log({
      zohoId,
      redirectUri,
      zohoScopes
    })
    void (async () => {
      const zohoAccountsBase = await getZohoAccountsBase()
      const authUrl =
        `${zohoAccountsBase}/oauth/v2/auth` +
        `?scope=${encodeURIComponent(zohoScopes)}` +
        `&client_id=${zohoId}` +
        `&state=${zohoEnvState}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&access_type=offline` +
        `&prompt=consent`
      window.location.href = authUrl
    })()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='primary' className='flex w-fit items-center gap-1'>
          <PlusIcon className='size-5' /> Add Apps
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[24rem] max-w-3xl'>
        <DialogHeader>
          <DialogTitle>App marketplace</DialogTitle>
          <DialogDescription>
            Get leads, visibility and much more with app integrations.
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-2'>
          <IntegrationCard
            isNew={true}
            name={'HubSpot'}
            handleCardClick={handleHubSpotCardClick}
          />
          <IntegrationCard
            isNew={true}
            name={'Zoho'}
            handleCardClick={handleZohoCardClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewAppDialog
