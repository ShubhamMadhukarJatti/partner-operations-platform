import { useState } from 'react'
import { ChevronDown, ChevronsUpDown, CloudDownload } from 'lucide-react'
import { CSVLink } from 'react-csv'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { RetryIcon } from '@/components/icons/icons'

export function ExportOption({
  csvData,
  handleHubspotClick,
  analyticsData,
  loadingText,
  hubspotSyncLoading,
  zohoSyncLoading,
  handleZohoClick
}: any) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={!analyticsData}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          Export/Sync Options
          <ChevronDown className='opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=' p-0'>
        <DropdownMenuLabel className='text-sm font-semibold text-[#ADB7CB]'>
          Export/Sync Options
        </DropdownMenuLabel>
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                {' '}
                <CSVLink data={csvData} filename='leads.csv'>
                  <button className='flex gap-2 text-sm font-semibold text-[#181D27]'>
                    <CloudDownload size={20} /> Export as CSV
                  </button>
                </CSVLink>
              </CommandItem>
              <CommandItem>
                {' '}
                <Button
                  // disabled
                  variant='outline'
                  className='flex h-fit gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-[#181D27]'
                  onClick={() => handleHubspotClick()}
                  loading={hubspotSyncLoading}
                  loadingText={'Syncing...'}
                >
                  <RetryIcon />
                  Sync Leads with HubSpot
                </Button>
              </CommandItem>
              <CommandItem>
                {' '}
                <Button
                  // disabled
                  variant='outline'
                  className='flex h-fit gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-[#181D27]'
                  onClick={() => handleZohoClick()}
                  loading={zohoSyncLoading}
                  loadingText={'Syncing...'}
                >
                  <RetryIcon />
                  Sync Leads with Zoho
                </Button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
