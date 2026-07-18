import React, { Dispatch, SetStateAction, useState } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import {
  getSalesforceData,
  getSalesforceFields
} from '@/lib/db/customer-persona'
import { getUniqueValuesFromObject } from '@/lib/utils'

import { recordType } from '../../my-data/_components/Segment'
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

const ConnectSalesforce = ({
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

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const handleGetColumns = async (): Promise<Record<string, string>> => {
    return new Promise(async (res, rej) => {
      const result = await getSalesforceFields(recordType)
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
      if (!uniqueColumns.includes('Id')) {
        uniqueColumns.push('Id')
      }
      const response = await getSalesforceData(
        org.id,
        uniqueColumns,
        recordType
      )
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

  console.log({ csvData, csvHeaders })
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConsentStep
            sourceIcon='/salesforce-match.svg'
            setStep={() => {
              handleGetColumns()
            }}
            isUploaded={true}
            dataSource='HubSpot'
            setIsOpen={setIsOpen}
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

export default ConnectSalesforce
