'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { ReactFlowProvider } from '@xyflow/react'
import { ArrowLeft } from 'iconsax-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'

import { CampaignFlow } from '../components/campaignFlow'
import { TemplateSettings } from '../components/TemplateSettings'
import {
  CampaignByIDResponseI,
  CampaignStatus,
  ITemplateWorkFlow,
  PartnerI
} from '../interfaces'
import { getCampaignById, updateCampaignTemplate } from '../services'

export default function Campaign({
  params
}: {
  readonly params: { readonly templateId: number }
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [publishConfirmationDialogue, setPublishConfirmationDialogue] =
    useState(false)
  const { loading: orgLoading, organization } = useSelector(
    (state: RootState) => state.currentOrg
  )
  const [templateData, setTemplateData] =
    useState<CampaignByIDResponseI | null>(null)
  const [allPartners, setAllPartners] = useState<PartnerI[]>([])
  const [selectedPartner, setSelectedPartner] = useState<string>('')
  const [templateWorkflow, setTemplateWorkflow] =
    useState<ITemplateWorkFlow | null>(null)

  const handlePublishConfirmation = async (
    templateData: CampaignByIDResponseI,
    selectedPartner: string
  ) => {
    setLoading(true)
    try {
      const createCampaignData = {
        organizationId: organization.id,
        sendAll: selectedPartner === 'all' ? true : false,
        partnerIds: [allPartners[0].orgId],
        status: CampaignStatus.Active,
        campaignType: templateData.campaignType,
        campaignName: templateData.campaignName,
        triggerFlow: {
          nodes: templateWorkflow
            ? templateWorkflow.nodes.map((cur) => JSON.stringify(cur))
            : [],
          edges: templateWorkflow
            ? templateWorkflow.edges.map((cur) => JSON.stringify(cur))
            : [],
          conditions: templateWorkflow ? templateWorkflow.conditions : []
        }
      }
      const data = await updateCampaignTemplate(createCampaignData)
      showCustomToast(
        'Success',
        'Campaign is activated successfully!',
        'success',
        2000
      )
    } catch (e: any) {
      console.log(e)
      showCustomToast(
        'Error',
        e?.response?.data?.message || 'Something went wrong',
        'error',
        2000
      )
    }
    setLoading(false)
  }

  const handleGetCampaignById = async () => {
    const data = await getCampaignById(String(params.templateId))
    const templateFlow: ITemplateWorkFlow = {
      nodes: data.triggerFlow.nodes.map((cur) => {
        const parsed = JSON.parse(cur)
        if (parsed?.data?.icon) {
          parsed.data.icon = ''
        }

        return parsed
      }),
      edges: data.triggerFlow.edges.map((cur) => JSON.parse(cur)),
      conditions: data.triggerFlow.conditions.map((cur) => ({
        conditionLabel: cur.conditionLabel,
        nodeIdsUnderCondition: cur.nodeIds ? cur.nodeIds : []
      }))
    }
    setTemplateWorkflow(templateFlow)
    setAllPartners(data.activePartners)
    setTemplateData(data)
  }

  useEffect(() => {
    handleGetCampaignById()
  }, [params])

  if (!templateData) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div>
          <p className='mb-4 text-lg font-medium'> Template not found</p>
          <Link
            href='/campaigns'
            className=' ml-10 rounded bg-[#0062F1] px-3 py-2 text-white'
          >
            Go Back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto h-full w-11/12 overflow-hidden p-4'>
      <div className='flex items-center gap-4'>
        <Link
          href='/campaigns'
          className='flex items-center gap-2 text-[#0062F1] hover:cursor-pointer'
        >
          <ArrowLeft size={24} color='#0062F1' />
          <p className='hidden text-xl font-bold md:block'>Back</p>
        </Link>
        <h1 className='text-xs font-semibold md:text-2xl'>
          {templateData.campaignName}
        </h1>
        <Button
          onClick={() => {
            setPublishConfirmationDialogue(true)
          }}
          className='ml-auto rounded-md font-bold'
        >
          Publish
        </Button>
      </div>
      <ReactFlowProvider>
        <div className=' flex h-[60rem] w-full flex-col justify-between md:h-full md:flex-row'>
          <div className='h-full w-full md:w-[70%]'>
            {!!templateWorkflow && (
              <CampaignFlow
                templateWorkFlow={templateWorkflow}
                isEditable={true}
              />
            )}
          </div>
          <TemplateSettings
            allPartners={allPartners}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
          />
        </div>
      </ReactFlowProvider>
      <Dialog
        open={publishConfirmationDialogue}
        onOpenChange={setPublishConfirmationDialogue}
      >
        <DialogContent hideCloseBtn={true} className='max-w-xl space-y-2'>
          <div className='flex flex-col items-center'>
            <Image
              src={'/assets/confirm-publish.png'}
              height={190}
              width={175}
              alt='confirm-publishing'
            />
            <h1 className='mt-4 text-xl font-bold'>
              Confirm the Publishing of Email Campaign
            </h1>
            <p className='text-md mt-2 font-normal'>
              Once started the campaign could not be edited but only paused or
              cancelled. Please confirm your changes before proceeding further.
            </p>
            <div className='flex w-full gap-4'>
              <Button
                className='mt-6 w-full rounded-md border bg-transparent font-bold text-[black] hover:bg-slate-50'
                onClick={() => setPublishConfirmationDialogue(false)}
              >
                Later
              </Button>
              <Button
                className='mt-6 w-full rounded-md font-bold'
                onClick={async () => {
                  await handlePublishConfirmation(templateData, selectedPartner)
                  setPublishConfirmationDialogue(false)
                }}
                loading={loading}
              >
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
