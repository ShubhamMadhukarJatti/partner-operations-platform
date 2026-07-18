'use client'

import { useState } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import {
  buildHubSpotOAuthUrl,
  getNormalizedHubSpotScopes
} from '@/lib/crm-oauth'
import {
  getHubspotColumnsList,
  getHubspotDataBasedOnColumns
} from '@/lib/db/customer-persona'
import { getUniqueValuesFromObject } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'

import Step1 from './ConnectHubspot/step-1'
import Step2 from './ConnectHubspot/step-2'
import PersonaModalHeader from './persona-modal-header'
import StatsGrid from './stats-grid'

const DEFAULT_COLUMNS = [
  'firstname',
  'lastname',
  'email',
  'company',
  'leadstatus'
]

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  csvData: any[]
  setCsvData: (data: any[]) => void
  csvHeaders: string[]
  setCsvHeaders: (headers: string[]) => void
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  setShowTable: (showTable: boolean) => void
  isConnected: boolean
  dataSource: 'CSV' | 'HUBSPOT' | 'GOOGLE_SHEET'
}
const ConnectHubspot = ({
  dataSource,
  open,
  setOpen,
  csvData,
  csvHeaders,
  selectedMapping,
  setSelectedMapping,
  setCsvHeaders,
  setCsvData,
  setShowTable,
  isConnected
}: Props) => {
  // const router = useRouter();
  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType
  const [step, setStep] = useState(1)

  const [columnsList, setColumnsList] = useState<string[]>([])
  const [defaultHeaders, setDefaultHeaders] =
    useState<string[]>(DEFAULT_COLUMNS)

  const handleCloseModal = () => setOpen(false)

  const handleConnectHubspot = () => {
    const redirectUri = process.env
      .NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string
    console.log(
      '-------------------------------- HUBSPOT --------------------------------'
    )
    console.log(
      'client_id',
      process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID as string
    )
    console.log('redirectUri', redirectUri)
    console.log('clientScopes', getNormalizedHubSpotScopes())
    const authUrl = buildHubSpotOAuthUrl({
      redirectUri,
      source: 'customer-persona-connect-hubspot'
    })
    window.open(authUrl)
  }

  // Step-1
  const handleContinueStep1 = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      if (!isConnected) handleConnectHubspot()
      const result = await getHubspotColumnsList(org.id)
      if (result?.statusCode === 500)
        return rej({ status: result.statusCode, msg: result.desc })
      setColumnsList(result)
      const defaultHeadersSet = new Set(defaultHeaders)
      setDefaultHeaders(
        result.filter((col: string) => defaultHeadersSet.has(col))
      )
      setStep(2)
      return res({ status: '200', msg: 'Success' })
    })
  }

  // Step-2
  const handleNextStep2 = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const uniqueColumns = getUniqueValuesFromObject(selectedMapping)
      const response = await getHubspotDataBasedOnColumns(org.id, uniqueColumns)
      if (response?.statusCode === 500)
        return rej({ status: response.statusCode, msg: response.desc })

      setCsvHeaders(uniqueColumns)

      const data = response?.results.map((item: any) => {
        const arr: any[] = []
        uniqueColumns.forEach((k) => {
          arr.push(item.properties[k])
        })
        return arr
      })
      setCsvData(data)
      setStep(3)
      return res({ status: '200', msg: 'Success' })
    })
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1 onClose={handleCloseModal} onContinue={handleContinueStep1} />
        )
      case 2:
        return (
          <Step2
            allHeaders={columnsList}
            defaultHeaders={defaultHeaders}
            onClose={handleCloseModal}
            onContinue={handleNextStep2}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
          />
        )
      case 3:
        return (
          <DrawerContent className='gap-6 rounded-2xl px-5 py-4 sm:max-w-[569px]'>
            <PersonaModalHeader
              title='Import Data'
              description='Few final details before you import marketing data.'
              logo='/csv.svg'
              setOpen={setOpen}
            />
            <StatsGrid
              csvData={csvData}
              csvHeaders={csvHeaders}
              selectedMapping={selectedMapping}
            />
            <DrawerFooter className='mt-6'>
              <DrawerClose asChild>
                <Button
                  onClick={handleCloseModal}
                  className='h-12 w-full rounded-lg border border-text-20 bg-white text-base font-bold leading-5 text-text-100 hover:bg-background-ghost-white hover:text-text-100 disabled:bg-text-20 disabled:text-text-60'
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                disabled={Object.values(selectedMapping).some(
                  (value) => value === ''
                )}
                onClick={() => {
                  setOpen(false)
                  setShowTable(true)
                }}
                className='h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60 '
              >
                Import
              </Button>
            </DrawerFooter>
          </DrawerContent>
        )
      default:
        return null
    }
  }

  return <Drawer open={open}>{renderStepContent()}</Drawer>
}

export default ConnectHubspot
