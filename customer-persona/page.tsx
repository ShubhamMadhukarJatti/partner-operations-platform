'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { createPersona, getPersonaDetails } from '@/lib/db/customer-persona'
import { fetchconnectedApps } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'

import ConnectCSV from './_components/connect-csv'
import ConnectHubspot from './_components/connect-hubspot'
import ConnectSheets from './_components/connect-sheets'
import { CsvDataTable } from './_components/csv-data-table'
import PersonaAnalytics from './_components/persona-analytics'
import PersonaIntegrationCards from './_components/persona-integration-cards'

type Props = {}
type PersonaStatus = 'COMPLETED' | 'INITIATED' | 'OTHER'
const CustomerPersona = (props: Props) => {
  const [personaStatus, setPersonaStatus] = useState<PersonaStatus | null>()
  const [loading, setLoading] = useState(true)
  const [csvDialogOpen, setCsvDialogOpen] = useState(false)
  // const [linkedInDialogOpen, setLinkedInDialogOpen] = useState(false)
  const [hubspotDialogOpen, setHubspotDialogOpen] = useState(false)
  const [sheetsDialogOpen, setSheetsDialogOpen] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [personaResultData, setPersonaResultData] = useState([])
  const [csvData, setCsvData] = useState<any[]>([])
  // const [linkedInData, setLinkedInData] = useState<any[]>([])
  // const [crmData, setCrmData] = useState<any[]>([])
  const [connectedApps, setConnectedApps] = useState<Array<string>>([])

  const [finalData, setFinalData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])

  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({
    Website: '',
    'Full Name': ''
    // 'Phone Number': ''
    // City: '',
    // Country: ''
  })

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType
  const createPersonaData = async () => {
    try {
      const index = csvHeaders.indexOf(selectedMapping['Website'])
      const websites = csvData.map((data) => data[index])

      const response: any = await createPersona(org.id, websites)

      showCustomToast(
        'Success',
        'Customer Persona submitted successfully',
        'success',
        5000
      )

      setPersonaStatus('INITIATED')
    } catch (error: any) {
      showCustomToast('Error', error.message, 'error', 5000)
    }
  }

  useEffect(() => {
    async function getCustomerPersonaDetails() {
      try {
        setLoading(true)
        if (!org) return
        const connectedApps = await fetchconnectedApps()
        setConnectedApps(connectedApps?.map((c: any) => c?.integrationType))
        const data = await getPersonaDetails(org.id)
        setPersonaResultData(data)
        setPersonaStatus(data?.personaStatus)
        // setPersonaStatus(null)
      } catch (error: any) {
        showCustomToast(
          'Error',
          error.message || 'An error occurred',
          'error',
          5000
        )
      } finally {
        setLoading(false)
      }
    }

    getCustomerPersonaDetails()
  }, [org])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Logo className='h-10 w-auto animate-pulse' />
      </div>
    )

  return (
    <>
      {personaStatus === 'COMPLETED' && (
        <>
          <PersonaAnalytics personaResultData={personaResultData} />
        </>
      )}
      {personaStatus === 'INITIATED' && (
        <>
          <div className='p-4'>
            <div className='mb-4 flex flex-row items-center justify-between'>
              <h1 className='text-2xl font-bold leading-[29px] text-text-100'>
                Customer Persona Analytics
              </h1>
            </div>

            <div>
              <div className='border-semantic-success-500 bg-semantic-success-100  mb-4 flex  gap-3 rounded-lg border bg-[#83C4131A] p-4 '>
                <Image
                  src='/profile-circle.svg'
                  alt='Success icon'
                  width={40}
                  height={40}
                />

                <div className=''>
                  <p className='text-base font-bold leading-5 text-text-100'>
                    Your Customer persona is under review
                  </p>
                  <p className='text-sm leading-5 text-text-100 '>
                    This might take couple of minutes to complete. Once
                    completed would be shown below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {personaStatus !== 'COMPLETED' &&
        personaStatus !== 'INITIATED' &&
        (!showTable ? (
          <>
            <PersonaIntegrationCards
              setCsvDialogOpen={setCsvDialogOpen}
              setHubspotDialogOpen={setHubspotDialogOpen}
              setSheetsDialogOpen={setSheetsDialogOpen}
              connectedApps={connectedApps}
            />
          </>
        ) : (
          <>
            <div className='p-4'>
              <div className='mb-4 flex flex-row items-center justify-between'>
                <h1 className='text-2xl font-bold leading-[29px] text-text-100'>
                  Customer Persona
                </h1>

                <Button className='rounded-lg' onClick={createPersonaData}>
                  Create Persona
                </Button>
              </div>

              <div>
                <div className='border-semantic-success-500 bg-semantic-success-100  mb-4 flex  gap-3 rounded-lg border bg-[#83C4131A] p-4 '>
                  <Image
                    src='/file-circle.svg'
                    alt='Success icon'
                    width={40}
                    height={40}
                  />

                  <div className=''>
                    <p className='text-base font-bold leading-5 text-text-100'>
                      {csvData.length} Contacts from the file imported
                      successfully.
                    </p>
                    <p className='text-sm leading-5 text-text-100 '>
                      This might take couple of minutes to complete. Once
                      completed would be shown below
                    </p>
                  </div>
                </div>
              </div>
              <CsvDataTable
                selectedMapping={selectedMapping}
                data={csvData}
                csvHeaders={csvHeaders}
              />
            </div>
          </>
        ))}

      {csvDialogOpen && (
        <ConnectCSV
          dataSource='CSV'
          open={csvDialogOpen}
          setOpen={setCsvDialogOpen}
          csvData={csvData}
          setCsvData={setCsvData}
          csvHeaders={csvHeaders}
          setCsvHeaders={setCsvHeaders}
          selectedMapping={selectedMapping}
          setSelectedMapping={setSelectedMapping}
          setFinalData={setFinalData}
          finalData={finalData}
          setShowTable={setShowTable}
        />
      )}
      {hubspotDialogOpen && (
        <ConnectHubspot
          dataSource='HUBSPOT'
          open={hubspotDialogOpen}
          setOpen={setHubspotDialogOpen}
          csvData={csvData}
          setCsvData={setCsvData}
          csvHeaders={csvHeaders}
          setCsvHeaders={setCsvHeaders}
          selectedMapping={selectedMapping}
          setSelectedMapping={setSelectedMapping}
          setShowTable={setShowTable}
          isConnected={connectedApps.includes(INTEGRATIONS.HUBSPOT_OUTREACH)}
        />
      )}
      {sheetsDialogOpen && (
        <ConnectSheets
          dataSource='GOOGLE_SHEET'
          open={sheetsDialogOpen}
          setOpen={setSheetsDialogOpen}
          csvData={csvData}
          setCsvData={setCsvData}
          csvHeaders={csvHeaders}
          setCsvHeaders={setCsvHeaders}
          selectedMapping={selectedMapping}
          setSelectedMapping={setSelectedMapping}
          setFinalData={setFinalData}
          finalData={finalData}
          setShowTable={setShowTable}
          isConnected={connectedApps.includes(INTEGRATIONS.GOOGLE_SHEET)}
        />
      )}
    </>
  )
}

export default CustomerPersona
