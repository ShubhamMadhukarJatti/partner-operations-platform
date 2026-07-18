import { Button } from '@/components/ui/button'

const Page = () => {
  return (
    <div className='flex h-full flex-row'>
      <div className='h-full w-[450px] flex-1 bg-primary p-5'>
        <p className='text-[52px] font-bold text-white'>MOU</p>
        <p className='mb-5 text-[13px] text-white'>
          This MOU may be terminated by either party, for any reason, by giving
          30 days written notice
        </p>
        <div className='flex flex-col gap-[10px]'>
          <div className='flex flex-row justify-between text-[13px] text-white'>
            <p className='font-bold'>Created on</p>
            <p>03-10-2023</p>
          </div>
          <div className='flex flex-row justify-between text-[13px] text-white'>
            <p className='font-bold'>Updated on</p>
            <p>03-10-2023</p>
          </div>
          <div className='text-[13px] font-bold text-white'>
            <p>View previous versions</p>
          </div>
        </div>

        <div className='my-[10px] mb-10 flex flex-row gap-[10px]'>
          <Button
            variant='outline'
            size='xs'
            className='border border-white bg-primary text-[13px] text-white hover:bg-white hover:text-black'
          >
            03-10-2023
          </Button>

          <Button
            variant='outline'
            size='xs'
            className='border border-white bg-primary text-[13px] text-white hover:bg-white hover:text-black'
          >
            03-10-2023
          </Button>

          <Button
            variant='outline'
            size='xs'
            className='border border-white bg-primary text-[13px] text-white hover:bg-white hover:text-black'
          >
            03-10-2023
          </Button>
        </div>

        <div className='my-[10px] flex flex-col gap-[10px]'>
          <Button variant='outline' size='lg' className='rounded-lg'>
            Signature
          </Button>
          <Button variant='outline' size='lg' className='rounded-lg'>
            Signature
          </Button>
          <Button variant='outline' size='lg' className='rounded-lg'>
            Signature
          </Button>{' '}
          <Button variant='outline' size='lg' className='rounded-lg'>
            Signature
          </Button>
        </div>
        <div className='my-[10px] mt-20 flex flex-col gap-[10px]'>
          <Button variant='outline' size='lg' className='rounded-lg'>
            Save
          </Button>
          <Button
            variant='secondary'
            className='rounded-lg border border-white bg-primary text-white hover:bg-white hover:text-black'
            size='lg'
          >
            Share with partner
          </Button>
        </div>
      </div>
      <div className='w-full text-black'>
        <div className='p-5'>
          <h1 className='mb-4  text-2xl font-bold'>
            MEMORANDUM OF UNDERSTANDING (MOU)
          </h1>
          <p>
            This Memorandum of Understanding (MOU) is made and entered into on
            the [DATE], by and between [startupA] and [startupB].
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Purpose and Scope</h2>
          <p>
            The purpose of this MOU is to partner [startupA], [stageA],
            [briefA], [addrA] with [startupB], [stageB], [briefB], [addrB] by
            sharing resources as mentioned in this document for mutual growth.
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Responsibilities</h2>
          <p>
            [startupA] responsibilities include offering of A, [startupB]
            responsibilities include expectation of A.
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Timeline</h2>
          <p>
            This MOU is effective for three months, starting from [startMONTH],
            2023 to [endMONTH], 2023.
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Communication</h2>
          <p>
            Email for [startupA] is [emailA], email for [startupB] is [emailB].
            No unsecured embedded link should be provided by either startup for
            security reasons.
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Confidentiality</h2>
          <p>
            The information regarding this agreement will not be shared outside
            of the Sharkdom team and among members of either startup.
          </p>
          <h2 className='mt-4 text-lg font-semibold'>Governing Law</h2>
          <p>
            {`Any disputes arising from or related to this MOU shall be resolved
            by law in case the Mediator, which in this case is 'SharkDom,' is
            unable to resolve the issue as agreed by both parties. This MOU
            contains the entire understanding of the parties and supersedes all
            prior negotiations, understandings, and agreements between them,
            whether oral or written before the initiation of the partnership
            inside the platform. This MOU may only be modified in writing and
            signed by both parties.`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
