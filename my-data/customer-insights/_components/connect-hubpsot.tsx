import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import {
  getHubspotColumnsListByRecordType,
  getHubspotDataBasedOnColumns
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

const ConnectHubspot = ({
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
  const { integrations, refetch } = useIntegrationApps()

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  // Check if HubSpot is already connected
  const isHubSpotConnected = integrations?.some(
    (integration: any) =>
      integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
      integration.status === INTEGRATION_STATUS.CONNECTED
  )

  // If HubSpot is already connected, skip the consent step
  useEffect(() => {
    if (isHubSpotConnected) {
      setStep(2)
      handleGetColumns()
    }
  }, [isHubSpotConnected])

  const handleGetColumns = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const result = await getHubspotColumnsListByRecordType(org.id, recordType)
      if (result?.statusCode === 500)
        return rej({ status: result.statusCode, msg: result.desc })
      setCsvHeaders(result)
      setStep(2)
      return res({ status: '200', msg: 'Success' })
    })
  }

  const handleGetColumnsData = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const uniqueColumns = getUniqueValuesFromObject(selectedMapping)
      const response = await getHubspotDataBasedOnColumns(
        org.id,
        uniqueColumns,
        recordType
      )
      if (response?.statusCode === 500)
        return rej({ status: response.statusCode, msg: response.desc })

      setCsvHeaders(uniqueColumns)

      const records = Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

      const data = records.map((item: any) => {
        const sourceObject =
          item?.properties && typeof item.properties === 'object'
            ? item.properties
            : item
        const arr: any[] = []
        uniqueColumns.forEach((k) => {
          arr.push(sourceObject?.[k] ?? item?.[k] ?? '')
        })
        return arr
      })
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
            isUploaded={!isHubSpotConnected}
            dataSource='HubSpot'
            setIsOpen={setIsOpen}
            onAuthenticated={async () => {
              // Refresh connected apps state without resetting the wizard.
              const response = await refetch()
              if (!response || !response.data) return false
              return (
                response.data.some(
                  (integration: any) =>
                    integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
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

export default ConnectHubspot
