import React from 'react'

const ClarificationReply = () => {
  return (
    <div>
      <div className='flex flex-col gap-2 rounded-xl border-b bg-[#F0F6FC] p-2'>
        <p className='text-base '>
          This is the comment user gave when we asked him to specify about his
          doubts
        </p>
        <div className='flex flex-col gap-2.5 border-l-2 border-l-primary bg-[#F0F6FC] p-2'>
          <p className='text-base leading-5'>API integration</p>
          <p className='line-clamp-1 text-ellipsis text-sm text-[#475467]'>
            This is the expectation from us. We want to integrate Zomato API in
            our product. I think it would be beneficial to both parties and can
            lead to huge revenue source for both the parties.
          </p>
        </div>
      </div>
      <div className='px-2.5 py-3'>
        <p>
          This is the reply user gave when we asked him to specify about his
          doubts
        </p>
      </div>
    </div>
  )
}

export default ClarificationReply
