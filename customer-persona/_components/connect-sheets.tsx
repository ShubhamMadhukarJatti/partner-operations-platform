'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useSelector } from 'react-redux'

import { getGoogleSheetIdFromUrl, getUniqueValuesFromObject } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'

import Step1 from './ConnectGSheet/step-1'
import Step2 from './ConnectGSheet/step-2'
import Step3 from './ConnectGSheet/step-3'
import PersonaModalHeader from './persona-modal-header'
import StatsGrid from './stats-grid'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  csvData: any[]
  setCsvData: (data: any[]) => void
  csvHeaders: string[]
  setCsvHeaders: (headers: string[]) => void
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  setFinalData: (data: any[]) => void
  finalData: any[]
  setShowTable: (showTable: boolean) => void
  isConnected: boolean
  dataSource: 'CSV' | 'HUBSPOT' | 'GOOGLE_SHEET'
}
const ConnectSheets = ({
  dataSource,
  open,
  setOpen,
  csvData,
  setCsvData,
  csvHeaders,
  setCsvHeaders,
  selectedMapping,
  setSelectedMapping,
  // setFinalData,
  // finalData,
  setShowTable,
  isConnected
}: Props) => {
  const router = useRouter()
  const [step, setStep] = useState(isConnected ? 2 : 1)
  const [sheetId, setSheetId] = useState<string | any>('')
  const [columnsList, setColumnsList] = useState<string[]>([])

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const handleCloseModal = () => setOpen(false)

  // Step-1
  const handleContinueStep1 = (): void => {
    if (!isConnected) {
      signIn('google', undefined, {
        scope:
          'openid https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
      })
    } else {
      setStep(2)
    }
  }

  // Step-2
  const handleOnConnectStep2 = (
    sheetUrl: string
  ): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const result = await axios.get(
        `/api/google-sheets/columns?sheetUrl=${sheetUrl}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (result?.status !== 200)
        return rej({ status: result.status, msg: result?.data?.error })
      else {
        setColumnsList(result?.data?.data)
        setStep(3)
        return res({ status: String(result.status), data: result?.data })
      }
    })
  }

  // Step-3
  const handleOnNextStep3 = (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const uniqueColumns = getUniqueValuesFromObject(selectedMapping).filter(
        (c) => c !== 'other'
      )
      const result = await axios.get(
        `/api/google-sheets/${sheetId}?selectedColumns=${uniqueColumns.toString()}`
      )
      if (result?.status !== 200)
        return rej({ status: result.status, msg: result?.data?.error })
      else {
        setStep(4)
        setCsvHeaders(uniqueColumns)

        setCsvData(result?.data?.data)
        return res({ status: String(result.status), data: result?.data })
      }
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
            onClose={handleCloseModal}
            onConnect={(sheetUrl) => {
              const sheetId = getGoogleSheetIdFromUrl(sheetUrl)
              setSheetId(sheetId)
              return handleOnConnectStep2(sheetUrl)
            }}
          />
        )
      case 3:
        return (
          <Step3
            defaultHeaders={columnsList}
            onClose={handleCloseModal}
            onContinue={handleOnNextStep3}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
          />
        )
      case 4:
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

  return (
    <Drawer open={open}>
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Connect CSV</Button>
      </DialogTrigger> */}
      {renderStepContent()}
    </Drawer>
  )
}

export default ConnectSheets
