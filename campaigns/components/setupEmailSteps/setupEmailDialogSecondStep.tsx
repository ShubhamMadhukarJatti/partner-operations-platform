import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  DnsRecord,
  useEmailDomainRecords
} from '../../hooks/useGetEmailDomainRecords'

export const SetupEmailDialogSecondStep = ({
  onClickStepTwoNextBtn
}: {
  onClickStepTwoNextBtn: () => void
}) => {
  const {
    TXTRecords: txtRecord,
    CNAMERecords: cnameRecords,
    loading,
    error
  } = useEmailDomainRecords()

  return (
    <>
      <div className='mx-auto'>
        <StepTwoIcon />
      </div>
      <div className='flex flex-col gap-2 text-text-100'>
        <p className='fds-heading'>DNS Records</p>
        <p className='text-shark-base font-normal'>
          Copy these DNS records in your Domain Registrar to allow Sharkdom to
          send mails.
        </p>
      </div>

      {loading ? (
        <Loader size={24} className='mx-auto' />
      ) : (
        <>
          <CNAMERecords cnameRecords={cnameRecords ?? []} />
          <div className='border' />
          <TXTRecords txtRecord={txtRecord} />
          <Button
            onClick={onClickStepTwoNextBtn}
            className='mx-auto w-32 rounded-lg bg-[#0062F1] px-4 py-3 font-medium text-white hover:bg-[#0062F1]'
          >
            Verify Now
          </Button>
        </>
      )}
    </>
  )
}

const StepTwoIcon = () => (
  <svg
    width='161'
    height='41'
    viewBox='0 0 161 41'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M20.4987 3.83398C11.3154 3.83398 3.83203 11.3173 3.83203 20.5007C3.83203 29.684 11.3154 37.1673 20.4987 37.1673C29.682 37.1673 37.1654 29.684 37.1654 20.5007C37.1654 11.3173 29.682 3.83398 20.4987 3.83398ZM28.4654 16.6673L19.0154 26.1173C18.782 26.3507 18.4654 26.484 18.132 26.484C17.7987 26.484 17.482 26.3507 17.2487 26.1173L12.532 21.4007C12.0487 20.9173 12.0487 20.1173 12.532 19.634C13.0154 19.1507 13.8154 19.1507 14.2987 19.634L18.132 23.4673L26.6987 14.9007C27.182 14.4173 27.982 14.4173 28.4654 14.9007C28.9487 15.384 28.9487 16.1673 28.4654 16.6673Z'
      fill='#83C413'
    />
    <rect x='40.5' y='20' width='80' height='1' fill='#7688A8' />
    <circle cx='140.5' cy='20.5' r='19.5' stroke='black' />
    <path
      d='M137.619 25.5V24.2273L141.557 20.1477C141.977 19.7045 142.324 19.3163 142.597 18.983C142.873 18.6458 143.08 18.3258 143.216 18.0227C143.352 17.7197 143.42 17.3977 143.42 17.0568C143.42 16.6705 143.33 16.3371 143.148 16.0568C142.966 15.7727 142.718 15.5549 142.403 15.4034C142.089 15.2481 141.735 15.1705 141.341 15.1705C140.924 15.1705 140.561 15.2557 140.25 15.4261C139.939 15.5966 139.701 15.8371 139.534 16.1477C139.367 16.4583 139.284 16.822 139.284 17.2386H137.608C137.608 16.5303 137.771 15.911 138.097 15.3807C138.422 14.8504 138.869 14.4394 139.438 14.1477C140.006 13.8523 140.652 13.7045 141.375 13.7045C142.106 13.7045 142.75 13.8504 143.307 14.142C143.867 14.4299 144.305 14.8239 144.619 15.3239C144.934 15.8201 145.091 16.3807 145.091 17.0057C145.091 17.4375 145.009 17.8598 144.847 18.2727C144.688 18.6856 144.409 19.1458 144.011 19.6534C143.614 20.1572 143.061 20.7689 142.352 21.4886L140.04 23.9091V23.9943H145.278V25.5H137.619Z'
      fill='#2A3241'
    />
  </svg>
)

const CNAMERecords = ({ cnameRecords }: { cnameRecords: DnsRecord[] }) => {
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-shark-base font-bold'>CNAME Record</p>
      {cnameRecords.map((record, index) => (
        <div key={record.name} className='flex items-center justify-between'>
          <div className='flex w-1/3 flex-col gap-2 text-shark-sm font-normal'>
            <p>Host</p>
            <p>{record.name.substring(0, 7)}...</p>
          </div>
          <div className='flex w-1/3 flex-col items-center gap-2 text-shark-sm font-normal'>
            <p>Points to</p>
            <p>{record.value.substring(0, 17)}...</p>
          </div>
          <div className='flex w-1/3 flex-col gap-2 text-right text-shark-sm font-normal'>
            <p>TTL</p>
            <p>{record.ttl}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const TXTRecords = ({ txtRecord }: { txtRecord: DnsRecord | null }) => {
  if (!txtRecord) return null
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-shark-base font-bold'>TXT Record</p>

      <div className='flex items-center justify-between'>
        <div className='flex w-1/3 flex-col gap-2 text-shark-sm font-normal'>
          <p>Host</p>
          <p>{txtRecord.name.substring(0, 7)}...</p>
        </div>
        <div className='flex w-1/3 flex-col items-center gap-2 text-shark-sm font-normal'>
          <p>Points to</p>
          <p>{txtRecord.value.substring(0, 17)}...</p>
        </div>
        <div className='flex w-1/3 flex-col gap-2 text-right text-shark-sm font-normal'>
          <p>TTL</p>
          <p>{txtRecord.ttl}</p>
        </div>
      </div>
    </div>
  )
}
