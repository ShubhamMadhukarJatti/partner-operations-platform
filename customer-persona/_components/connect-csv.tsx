'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePersona } from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'

import MapProperties from './map-properties'
import PersonaModalHeader from './persona-modal-header'
import PersonaModalStep from './persona-modal-step'
import StatsGrid from './stats-grid'
import UploadCSV from './upload-csv'

type Props = {
  dataSource: 'CSV' | 'HUBSPOT' | 'GOOGLE_SHEET'
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
}
const ConnectCSV = ({
  dataSource,
  open,
  setOpen,
  csvData,
  setCsvData,
  csvHeaders,
  setCsvHeaders,
  selectedMapping,
  setSelectedMapping,
  setFinalData,
  finalData,
  setShowTable
}: Props) => {
  const router = useRouter()
  const createPersona = useCreatePersona()
  const [step, setStep] = useState(1)
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const handleFileChange = (data: any[], fileInfo: any) => {
    setCsvHeaders(data[0])
    setCsvData(data)

    // if (csvHeaders.length > 0) {
    //   const initialMapping: Record<string, string> = {}
    //   csvHeaders.forEach((header) => {
    //     const propertyName = Object.keys(selectedMapping).find(
    //       (property) => property.toLowerCase() === header.toLowerCase()
    //     )
    //     initialMapping[header] = propertyName || ''
    //   })
    //   console.log(initialMapping, 'initialMapping')
    //   setSelectedMapping(initialMapping)
    // }
    // setStep(2)
  }

  const handleCreatePersona = () => {
    // Extract sites and names from csvData based on selected mapping
    const sitesIndex = csvHeaders.indexOf(selectedMapping['Website'] || '')
    const namesIndex = csvHeaders.indexOf(selectedMapping['Full Name'] || '')

    const sites =
      sitesIndex !== -1
        ? csvData.map((row) => row[sitesIndex]).filter(Boolean)
        : []

    const names =
      namesIndex !== -1
        ? csvData.map((row) => row[namesIndex]).filter(Boolean)
        : []

    // Get the mapped frequency with a type-safe fallback
    const mappedFrequency = 'WEEKLY' as const

    // Create payload
    const payload = {
      organizationId: organization?.id || 0,
      sites,
      names,
      frequency: mappedFrequency,
      personaName: 'Marketing Data Import',
      personaMode: dataSource
    }

    console.log(payload)

    // Call the mutation
    createPersona.mutate(payload, {
      onSuccess: () => {
        // Close modal on success
        setOpen(false)
        setShowTable(true)
      }
    })
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <DrawerContent className='max-w-[90%] gap-6 rounded-2xl px-5 py-4 md:max-w-[483px]'>
            <PersonaModalHeader
              title='Upload CSV'
              description='Upload the CSV file that has access set to open.'
              logo='/csv.svg'
              setOpen={setOpen}
            />
            <PersonaModalStep isCompleted={false} />
            <UploadCSV
              onChange={handleFileChange}
              setCsvData={setCsvData}
              setCsvHeaders={setCsvHeaders}
            />
            <DrawerFooter className='mt-6'>
              <Button
                disabled={!csvData.length}
                onClick={() => setStep(2)}
                className='h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60 '
              >
                Upload
              </Button>
            </DrawerFooter>
          </DrawerContent>
        )
      case 2:
        return (
          <DrawerContent className='gap-6 rounded-2xl px-5 py-4 sm:max-w-[569px]'>
            <PersonaModalHeader
              title='Map Properties'
              description='Ensure columns from your file are mapped correctly to contact properties.'
              logo='/csv.svg'
              setOpen={setOpen}
            />
            <PersonaModalStep isCompleted={true} />
            <MapProperties
              headers={csvHeaders}
              selectedMapping={selectedMapping}
              setSelectedMapping={setSelectedMapping}
            />
            <DrawerFooter className='mt-6'>
              <DrawerClose asChild>
                <Button className='h-12 w-full rounded-lg border border-text-20 bg-white text-base font-bold leading-5 text-text-100 hover:bg-background-ghost-white hover:text-text-100 disabled:bg-text-20 disabled:text-text-60'>
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                disabled={Object.values(selectedMapping).some(
                  (value) => value === ''
                )}
                onClick={() => setStep(3)}
                className='h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60 '
              >
                Next
              </Button>
            </DrawerFooter>
          </DrawerContent>
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
                <Button className='h-12 w-full rounded-lg border border-text-20 bg-white text-base font-bold leading-5 text-text-100 hover:bg-background-ghost-white hover:text-text-100 disabled:bg-text-20 disabled:text-text-60'>
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                disabled={Object.values(selectedMapping).some(
                  (value) => value === ''
                )}
                onClick={() => handleCreatePersona()}
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
    <Drawer open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Connect CSV</Button>
      </DialogTrigger> */}
      {renderStepContent()}
    </Drawer>
  )
}

export default ConnectCSV
