import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import { recordType } from '../../my-data/_components/Segment'
import { DataSource } from '../page'
import ConnectHubspot from './connect-hubpsot'
import ConnectSalesforce from './connect-salesforce'
import ConnectSheets from './connect-sheets'
import ConnectZoho from './connect-zoho'
import ConnectCSV from './connnect-csv'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataSource: DataSource
  recordType: recordType
  isFullScreen?: boolean
}

const PartnerMatchProcessModal = ({
  isFullScreen = true,
  isOpen,
  setIsOpen,
  dataSource,
  recordType
}: Props) => {
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({
    domain: '',
    name: '',
    companyName: '',
    contactEmail: '',
    dealStage: '',
    creationDate: '',
    closeDate: '',
    subscribed: '',
    ticketSize: ''
  })

  console.log({ selectedMapping })

  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])

  const renderContent = () => {
    switch (dataSource) {
      case 'HUBSPOT':
        return (
          <ConnectHubspot
            recordType={recordType}
            dataSource={dataSource}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            csvHeaders={csvHeaders}
            setCsvData={setCsvData}
            setIsOpen={setIsOpen}
            csvData={csvData}
            setCsvHeaders={setCsvHeaders}
          />
        )
      case 'SALESFORCE':
        return (
          <ConnectSalesforce
            recordType={recordType}
            dataSource={dataSource}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            csvHeaders={csvHeaders}
            setCsvData={setCsvData}
            setIsOpen={setIsOpen}
            csvData={csvData}
            setCsvHeaders={setCsvHeaders}
          />
        )
      case 'ZOHO':
        return (
          <ConnectZoho
            recordType={recordType}
            dataSource={dataSource}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            csvHeaders={csvHeaders}
            setCsvData={setCsvData}
            setIsOpen={setIsOpen}
            csvData={csvData}
            setCsvHeaders={setCsvHeaders}
          />
        )
      case 'GOOGLE_SHEET':
        return (
          <ConnectSheets
            recordType={recordType}
            dataSource={dataSource}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            csvHeaders={csvHeaders}
            setCsvData={setCsvData}
            setIsOpen={setIsOpen}
            csvData={csvData}
            setCsvHeaders={setCsvHeaders}
          />
        )
      case 'CSV':
        return (
          <ConnectCSV
            recordType={recordType}
            dataSource={dataSource}
            selectedMapping={selectedMapping}
            setSelectedMapping={setSelectedMapping}
            csvData={csvData}
            setCsvData={setCsvData}
            csvHeaders={csvHeaders}
            setCsvHeaders={setCsvHeaders}
            setIsOpen={setIsOpen}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        hideCloseBtn
        className={cn(
          'm-0 min-h-screen w-screen max-w-none rounded-none p-0 py-6',
          !isFullScreen ? 'min-h-[calc(100vh-50px)] max-w-[800px]' : ''
        )}
      >
        <ScrollArea
          className={cn(
            'scroll-hidden h-screen',
            !isFullScreen ? 'h-[calc(100vh-50px)]' : ''
          )}
        >
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PartnerMatchProcessModal
