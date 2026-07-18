import { ITemplateData } from '../interfaces'
import { CampaignFlow } from './campaignFlow'

export const DialogContentData = ({
  templateData
}: {
  templateData: ITemplateData
}) => {
  return (
    <>
      <h2 className='mb-1 text-2xl font-bold text-[#2A3241]'>
        {templateData.title}
      </h2>
      <p className='text-sm text-[#7688A8]'>{templateData.subtitle}</p>
      <div className='mt-6 flex w-full justify-between'>
        <div>
          <h3 className='text-md mb-1 font-bold'>Purpose</h3>
          <p className='w-[90%] text-sm text-[#7688A8]'>
            {templateData.purposeText}
          </p>
        </div>
        <div>
          <h3 className='text-md mb-1 font-bold'>Frequency</h3>
          <p className='text-sm text-[#7688A8]'>{templateData.frequency}</p>
        </div>
      </div>
      <CampaignFlow
        templateWorkFlow={templateData?.templateWorkFlow}
        isEditable={false}
      />
    </>
  )
}
