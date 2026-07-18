import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

import '@xyflow/react/dist/style.css'

import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'

import { CampaignStatus, ITemplateData } from '../interfaces'
import { createCampaignTemplate } from '../services'
import { DialogContentData } from './dialogContent'

export const DialogueButton = ({
  title,
  templateData
}: {
  title: string
  templateData: ITemplateData
}) => {
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { loading: orgLoading, organization } = useSelector(
    (state: RootState) => state.currentOrg
  )

  const handleCreateCampaign = async (templateData: ITemplateData) => {
    setLoading(true)
    try {
      const createCampaignData = {
        organizationId: organization.id,
        sendAll: false,
        partnerIds: [],
        status: CampaignStatus.Draft,
        campaignType: templateData.type,
        campaignName: templateData.title,
        triggerFlow: {
          nodes: templateData.templateWorkFlow.nodes.map((cur) =>
            JSON.stringify(cur)
          ),
          edges: templateData.templateWorkFlow.edges.map((cur) =>
            JSON.stringify(cur)
          ),
          conditions: templateData.templateWorkFlow.conditions
        }
      }
      console.log(templateData)
      console.log(createCampaignData)
      const data = await createCampaignTemplate(createCampaignData)
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    // setLoading(false)
  }

  return (
    <div>
      <button
        onClick={() => setIsDialogueOpen(true)}
        className='mt-4 flex w-32 transform transition-all duration-300 ease-in-out hover:scale-105'
      >
        <p className='mr-2 text-xs text-[#0062F1]'>{title}</p>
        <ArrowRight size={16} color='#0062F1' />
      </button>
      <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
        <DialogContent hideCloseBtn={true} className='max-w-4xl space-y-2'>
          <DialogHeader>
            <div className='width-full flex justify-between'>
              <button
                onClick={() => {
                  setIsDialogueOpen(false)
                }}
                className='flex items-center gap-2 text-[#0062F1] hover:cursor-pointer'
              >
                <ArrowLeft size={20} color='#0062F1' />
                <p className='text-md font-bold'>Back</p>
              </button>
              <Button
                onClick={async () => {
                  await handleCreateCampaign(templateData)
                  router.push(`/campaigns/${templateData.id}`)
                }}
                className='rounded'
                color='primary'
                loading={loading}
                disabled={loading}
              >
                Use this Template
              </Button>
            </div>
          </DialogHeader>
          <DialogContentData templateData={templateData} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
