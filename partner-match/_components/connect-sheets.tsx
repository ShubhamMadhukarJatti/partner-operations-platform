import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from 'axios'
import { set } from 'zod'

import { getGoogleSheetIdFromUrl, getUniqueValuesFromObject } from '@/lib/utils'
import { OutlinedInput } from '@/components/ui/outlined-input'

import { recordType } from '../../my-data/_components/Segment'
import { DataSource } from '../page'
import ConsentStep from './consent-step'
import FieldMapping from './field-mapping'
import MatchDataPreview from './match-data-preview'

interface Props {
  csvHeaders: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  csvData: any[]
  setCsvHeaders: Dispatch<SetStateAction<string[]>>
  setCsvData: (data: any[]) => void
  dataSource: DataSource
  recordType: recordType
}

const ConnectSheets = ({
  recordType,
  dataSource,
  setSelectedMapping,
  selectedMapping,
  setIsOpen,
  csvHeaders,
  csvData,
  setCsvHeaders,
  setCsvData
}: Props) => {
  const [step, setStep] = useState(1)
  const [fileLink, setFileLink] = useState('')
  const [sheetId, setSheetId] = useState<string | any>('')

  const handleGetSheetColumns = (
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
        setCsvHeaders(result?.data?.data)
        setStep(2)

        // setStep(3)
        return res({ status: String(result.status), data: result?.data })
      }
    })
  }

  const handleGetSheetData = (): Promise<Record<string, string>> => {
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
        setCsvHeaders(uniqueColumns)

        setCsvData(result?.data?.data)
        setStep(3)

        return res({ status: String(result.status), data: result?.data })
      }
    })
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConsentStep
            sourceIcon='/sheets-match.svg'
            source={
              <>
                <OutlinedInput
                  type='text'
                  label='Your Google Sheet link '
                  placeholder='https://sharkdom.com/startup/sharkdom_technologies..'
                  className='w-full'
                  onChange={(e) => setFileLink(e.target.value)}
                />
              </>
            }
            setStep={() => {
              const sheetId = getGoogleSheetIdFromUrl(fileLink)
              setSheetId(sheetId)
              handleGetSheetColumns(fileLink)
            }}
            isUploaded={!!fileLink}
            dataSource='Google Sheets'
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
              handleGetSheetData()
            }}
          />
        )
      case 3:
        return (
          <MatchDataPreview
            fileLink={fileLink}
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
    <div className='mx-auto w-full  max-w-[700px]'>{renderStepContent()}</div>
  )
}

export default ConnectSheets
