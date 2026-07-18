import { EmailSetupForm, EmailSetupFormValuesTypes } from '../emailSetupForm'

export const SetupEmailDialogFirstStep = ({
  onClickStepOneNextBtn
}: {
  onClickStepOneNextBtn: (values: EmailSetupFormValuesTypes) => void
}) => {
  return (
    <>
      <div className='mx-auto'>
        <StepOneStepTwoIncomplete />
      </div>
      <div className='flex flex-col gap-2 text-text-100'>
        <p className='fds-heading'>Set Up Email to Launch Campaigns!</p>
        <p className='text-shark-base font-normal'>
          This email address will be used to sent mails to your partners. Either
          you can use the below email or add another email address.
        </p>
      </div>
      <EmailSetupForm onClickStepOneNextBtn={onClickStepOneNextBtn} />
    </>
  )
}

const StepOneStepTwoIncomplete = () => (
  <svg
    width='161'
    height='40'
    viewBox='0 0 161 40'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='20.5' cy='20' r='19.5' stroke='black' />
    <path
      d='M22.0341 13.3636V25H20.2727V15.125H20.2045L17.4205 16.9432V15.2614L20.3239 13.3636H22.0341Z'
      fill='#2A3241'
    />
    <rect x='40.5' y='19.5' width='80' height='1' fill='#7688A8' />
    <circle cx='140.5' cy='20' r='19.5' stroke='black' />
    <path
      d='M137.619 25V23.7273L141.557 19.6477C141.977 19.2045 142.324 18.8163 142.597 18.483C142.873 18.1458 143.08 17.8258 143.216 17.5227C143.352 17.2197 143.42 16.8977 143.42 16.5568C143.42 16.1705 143.33 15.8371 143.148 15.5568C142.966 15.2727 142.718 15.0549 142.403 14.9034C142.089 14.7481 141.735 14.6705 141.341 14.6705C140.924 14.6705 140.561 14.7557 140.25 14.9261C139.939 15.0966 139.701 15.3371 139.534 15.6477C139.367 15.9583 139.284 16.322 139.284 16.7386H137.608C137.608 16.0303 137.771 15.411 138.097 14.8807C138.422 14.3504 138.869 13.9394 139.438 13.6477C140.006 13.3523 140.652 13.2045 141.375 13.2045C142.106 13.2045 142.75 13.3504 143.307 13.642C143.867 13.9299 144.305 14.3239 144.619 14.8239C144.934 15.3201 145.091 15.8807 145.091 16.5057C145.091 16.9375 145.009 17.3598 144.847 17.7727C144.688 18.1856 144.409 18.6458 144.011 19.1534C143.614 19.6572 143.061 20.2689 142.352 20.9886L140.04 23.4091V23.4943H145.278V25H137.619Z'
      fill='#2A3241'
    />
  </svg>
)
