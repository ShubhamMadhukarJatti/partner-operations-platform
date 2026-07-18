import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import {
  getHubspotColumnsList,
  getHubspotDataBasedOnColumns,
  getZohoData,
  getZohoDataHeaders
} from '@/lib/db/customer-persona'
import { getUniqueValuesFromObject } from '@/lib/utils'

import { recordType } from '../../_components/Segment'
import { DataSource } from '../page'
import ConsentStep from './consent-step'
import FieldMapping from './field-mapping'
import MatchDataPreview from './match-data-preview'

type Props = {
  csvHeaders: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
  csvData: any[]
  setCsvHeaders: Dispatch<SetStateAction<string[]>>
  setCsvData: (data: any[]) => void
  dataSource: DataSource
  recordType: recordType
}

const ConnectZoho = ({
  recordType,
  dataSource,
  setSelectedMapping,
  selectedMapping,
  setIsOpen,
  csvHeaders,
  csvData,
  setCsvData,
  setCsvHeaders
}: Props) => {
  const [step, setStep] = useState(1)
  const [zohoData, setZohoData] = useState([])
  const { integrations, refetch } = useIntegrationApps()

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  // Check if Zoho is already connected
  const isZohoConnected = integrations?.some(
    (integration: any) =>
      integration.id === INTEGRATIONS.ZOHO_CRM &&
      integration.status === INTEGRATION_STATUS.CONNECTED
  )

  // If Zoho is already connected, skip the consent step
  useEffect(() => {
    if (isZohoConnected) {
      setStep(2)
      handleGetColumns()
    }
  }, [isZohoConnected])

  const handleExtractDataFromColumns = (csvHeader: any, zohoData: any) => {
    const result = zohoData.map(({ ...obj }) =>
      csvHeader.map((k: any) => obj[k])
    )

    return result
  }

  const handleGetColumns = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const result = await getZohoDataHeaders(recordType)
      if (result?.length <= 0) return rej({ status: '500', msg: 'Zoho error' })
      setCsvHeaders(result)
      setStep(2)
      return res({ status: '200', msg: 'Success' })
    })
  }

  const handleGetColumnsData = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const uniqueColumns = getUniqueValuesFromObject(selectedMapping)
      const zohoData = await getZohoData(recordType)
      if (zohoData?.statusCode === 500)
        return rej({ status: zohoData?.statusCode, msg: zohoData?.desc })
      const data = handleExtractDataFromColumns(uniqueColumns, zohoData)

      setCsvHeaders(uniqueColumns)
      setCsvData(data)
      setStep(3)
      return res({ status: '200', msg: 'Success' })
    })
  }

  console.log({ csvData, csvHeaders })

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConsentStep
            sourceIcon='/hubspot-match.svg'
            setStep={() => {
              handleGetColumns()
            }}
            isUploaded={!isZohoConnected}
            dataSource='ZOHO'
            setIsOpen={setIsOpen}
            onAuthenticated={async () => {
              // Refresh connected apps state without resetting the wizard.
              const response = await refetch()
              if (!response || !response.data) return false
              return (
                response.data.some(
                  (integration: any) =>
                    integration.id === INTEGRATIONS.ZOHO_CRM &&
                    integration.status === INTEGRATION_STATUS.CONNECTED
                ) || false
              )
            }}
          />
        )
      case 2:
        return (
          <FieldMapping
            headers={csvHeaders}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            setIsOpen={setIsOpen}
            setStep={() => {
              handleGetColumnsData()
            }}
          />
        )
      case 3:
        return (
          <MatchDataPreview
            recordType={recordType}
            dataSource={dataSource}
            csvData={[csvHeaders, ...csvData]}
            csvHeaders={csvHeaders}
            selectedMapping={selectedMapping}
            setIsOpen={setIsOpen}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='mx-auto w-full max-w-[700px]'>{renderStepContent()}</div>
  )
}

export default ConnectZoho
