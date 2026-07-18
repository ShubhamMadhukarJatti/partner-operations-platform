import React from 'react'

import { StatusIndication } from '../../_components/status-indicator'
import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'

type Props = {
  data: any
  org: any
}

const OfflineProposal = ({ data, org }: Props) => {
  return (
    <DashboardItemWrapper className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-shark-lg font-bold text-text-100'>
          Offline Proposal
        </h3>

        {data?.onboarded ? (
          <StatusIndication status={'ACTIVE'} />
        ) : (
          <StatusIndication status={'Invitation Sent'} />
        )}
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-shark-base font-medium text-text-100'>
          <span>{org?.name}</span>

          <div>
            <svg
              width='30'
              height='15'
              viewBox='0 0 30 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.09622 2.4284C3.49345 1.03123 5.3296 0.332031 7.16634 0.332031C9.00249 0.332031 10.8387 1.03123 12.2377 2.4284L20.0495 10.242C20.7821 10.974 21.7562 11.3772 22.7929 11.3772C23.8291 11.3772 24.8026 10.9739 25.5352 10.242V10.2414C27.0467 8.72875 27.0467 6.2684 25.5352 4.75691C24.0231 3.24484 21.5628 3.24484 20.0501 4.75633L18.5509 6.25551L16.243 3.94756L17.7621 2.42846C20.5588 -0.366524 25.1086 -0.366524 27.9035 2.42846C30.6991 5.22344 30.6985 9.77318 27.9035 12.5705C26.5497 13.9238 24.7493 14.6699 22.834 14.6699C20.9169 14.6699 19.1159 13.9238 17.7621 12.5705L9.94972 4.75691C8.43706 3.24484 5.97671 3.24484 4.46464 4.75691C2.95315 6.2684 2.95315 8.72875 4.46464 10.2414C5.19724 10.974 6.17071 11.3772 7.20688 11.3772C8.24364 11.3772 9.2177 10.9739 9.94972 10.242L11.4489 8.74223L13.7568 11.0508L12.2377 12.5704C10.8839 13.9237 9.08288 14.6698 7.16581 14.6698C5.2505 14.6698 3.45009 13.9237 2.09628 12.5704C-0.698759 9.77371 -0.698759 5.22402 2.09622 2.4284Z'
                fill='#0062F1'
              />
            </svg>
          </div>

          <span>{data?.name}</span>
        </div>
        {/* <span className='inline-flex items-center  gap-1 text-shark-xs font-medium text-primary-light-blue'>
          <Clock size={16} />
          {moment(proposalData.creationTimestamp).fromNow()}
        </span> */}
      </div>
    </DashboardItemWrapper>
  )
}

export default OfflineProposal
