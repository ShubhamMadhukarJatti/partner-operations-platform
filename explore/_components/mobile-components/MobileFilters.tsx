import React from 'react'
import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import AdvanceFilter, { AdvanceFilterProp } from '../AdvanceFilter'
import CompanyProfileFilter from '../CompanyProfileFilter'
import PreferenceSetting from '../preference-setting/PreferenceSetting'

const MobileFilters: React.FC<AdvanceFilterProp> = ({
  searchQuery,
  setSearchQuery,
  subSectorsCommaSeparated,
  setSubSectorsCommaSeparated,
  sectorsCommaSeparated,
  setSectorsCommaSeparated,
  partnershipType,
  setPartnershipType
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className='absolute right-4 top-[83vh] z-[10] flex lg:hidden'
          variant='outline'
        >
          <SlidersHorizontal />{' '}
        </Button>
      </SheetTrigger>
      <SheetContent className='w-[80%] px-2'>
        <aside className='flex h-full w-full shrink-0 flex-col gap-6'>
          <ScrollArea className='hide-scrollbar h-full'>
            <div className='flex w-full flex-col gap-6'>
              <PreferenceSetting />
              <CompanyProfileFilter />

              {/* {shouldFetchConfig && ( */}
              <AdvanceFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                subSectorsCommaSeparated={subSectorsCommaSeparated}
                setSubSectorsCommaSeparated={setSubSectorsCommaSeparated}
                sectorsCommaSeparated={sectorsCommaSeparated}
                setSectorsCommaSeparated={setSectorsCommaSeparated}
                partnershipType={partnershipType}
                setPartnershipType={setPartnershipType}
              />
              {/* )} */}
            </div>
          </ScrollArea>
        </aside>
      </SheetContent>
    </Sheet>
  )
}

export default MobileFilters
