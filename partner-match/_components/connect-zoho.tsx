import React, { Dispatch, SetStateAction, useState } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import {
  getHubspotColumnsList,
  getHubspotDataBasedOnColumns,
  getZohoData,
  getZohoDataHeaders
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

  const org = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

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
      if (!uniqueColumns.includes('id')) {
        uniqueColumns.push('id')
      }
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
            isUploaded={true}
            dataSource='ZOHO'
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

export default ConnectZoho
