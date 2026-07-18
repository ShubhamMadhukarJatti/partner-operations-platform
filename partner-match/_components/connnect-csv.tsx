import { useState } from 'react'

import { recordType } from '../../my-data/_components/Segment'
import { DataSource } from '../page'
import ConsentStep from './consent-step'
import FieldMapping from './field-mapping'
import MatchDataPreview from './match-data-preview'
import UploadCSV from './upload-csv'

interface Props {
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  csvData: any[]
  setCsvData: (data: any[]) => void
  csvHeaders: string[]
  setCsvHeaders: (headers: string[]) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataSource: DataSource
  recordType: recordType
}

const ConnectCSV = ({
  recordType,
  setSelectedMapping,
  selectedMapping,
  csvData,
  setCsvData,
  csvHeaders,
  setCsvHeaders,
  setIsOpen,
  dataSource
}: Props) => {
  const [step, setStep] = useState<number>(1)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleFileChange = (data: any[], fileInfo: any) => {
    if (data.length > 0) {
      setCsvHeaders(data[0])
      setCsvData(data)
      setIsUploaded(true) // Mark upload as complete
    } else {
      setIsUploaded(false) // Ensure step cannot proceed without data
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ConsentStep
            sourceIcon='/csv-match.svg'
            setStep={() => {
              setStep(2)
            }}
            isUploaded={isUploaded}
            dataSource='CSV'
            setIsOpen={setIsOpen}
            source={
              <>
                <div className='mb-2'>
                  <h3 className='text-shark-lg font-semibold text-text-100'>
                    Field mapping
                  </h3>
                  <p className='mt-1 text-shark-sm text-text-80'>
                    AI auto-suggests best field mapping
                  </p>
                </div>
                <UploadCSV
                  onChange={handleFileChange}
                  setCsvData={setCsvData}
                  setCsvHeaders={setCsvHeaders}
                />
              </>
            }
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
              setStep(3)
            }}
          />
        )
      case 3:
        return (
          <MatchDataPreview
            recordType={recordType}
            dataSource={dataSource}
            csvData={csvData}
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
    <div className='hide-scrollbar mx-auto w-full max-w-[700px] overflow-y-scroll'>
      {renderStepContent()}
    </div>
  )
}

export default ConnectCSV
