import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import {
  useGetIsTestedCampaign,
  usePartnerPrograms,
  useReferralPartnerInvite
} from '@/http-hooks/partner-programs'
import { useCreateSpace } from '@/http-hooks/partner-space'
import { RootState } from '@/redux/store'
import { Check, Copy } from 'iconsax-react'
import { AlertCircle, ArrowLeft, Info } from 'lucide-react'
import { useSelector } from 'react-redux'

import { updateChatMessages } from '@/lib/actions/inbox'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CodeBlock } from '@/components/ui/code-block'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'

import Loader from '../../explore-2/_components/org-loader'

type Props = {}

const ReferralAddPartner = ({
  campaignId,
  programName,
  description,
  referralCode,
  referralLink,
  buttonVariant = 'default'
}: {
  campaignId?: string // used for showing single rp for partner
  programName?: string // used for showing single rp for partner
  description?: string // used for showing single rp for partner
  referralCode?: string // used for showing single rp for partner (must send if want to show only one RP)
  referralLink: string // used for showing single rp for partner
  buttonVariant?: 'link' | 'default'
}) => {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState('')
  const { data, isLoading } = useCollaborationsData('ACTIVE')
  const [triedTesting, setTriedTesting] = useState(false)
  const router = useRouter()
  const [website, setWebsite] = useState('')
  const { data: allPrograms } = usePartnerPrograms() as any
  const mutation = useReferralPartnerInvite()
  const [selectedProgram, setSelectedProgram] = useState<any>()
  const {
    data: isTestedCampaign,
    refetch,
    isLoading: statusLoading
  } = useGetIsTestedCampaign(
    referralCode ? referralCode : selectedProgram?.referralCode,
    referralLink
  ) as any
  const saved = useSelector((state: RootState) => state.currentOrg)

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleCopy = async (script: string) => {
    const textToCopy = script
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    // setCopied(true)
    // setTimeout(() => setCopied(false), 2000)
  }

  const handlePartnerChange = (value: string) => {
    setSelectedPartner(value)
  }

  const handleSendInvitation = () => {
    if (!selectedPartner) {
      showCustomToast('Error', 'Please select a partner', 'error', 5000)
      return
    }

    if (campaignId) {
      mutation.mutate(
        {
          partnerId: selectedPartner,
          campaignId,

          message
        },
        {
          onSuccess: async (response: any) => {
            showCustomToast('Success', 'Invitation sent', 'success', 5000)
            router.push('/partner-programs/home')
          }
        }
      )
    }
  }

  const maxCharacters = 275
  const remainingCharacters = maxCharacters - message.length

  const script = `
<script>
// this will give the impression data 
function executeImpressionApi() {

var referralCode = "${referralCode ? referralCode : selectedProgram?.referralCode}";

var impressionApiUrl = '${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=' + referralCode + '&type=impression';



var xhr = new XMLHttpRequest();

xhr.open('GET', impressionApiUrl, true);

xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {

    if (xhr.status === 200) {

        console.log("Impression successfully tracked!");

    } else {

        console.log("Failed to track impression!");

    }

};

xhr.onerror = function() {

    console.error("Error tracking impressions");

};

xhr.send();

}
// this function will be called onClick  , name of function  should be match  as Onclick calling function name 
function submitForm(event) {

event.preventDefault();

var referralCode = "${referralCode ? referralCode : selectedProgram?.referralCode}"; 

var name = encodeURIComponent(document.getElementById('name').value);

var email = encodeURIComponent(document.getElementById('email').value);

var phone = encodeURIComponent(document.getElementById('phone').value);


// this will give the lead data 

var leadApiUrl =
    '${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=' + referralCode + '&name=' + name + '&email=' + email + '&mobile=' + phone + '&type=lead';

var xhr = new XMLHttpRequest();

xhr.open('GET', leadApiUrl, true);

xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {

    if (xhr.status === 200) {

        console.log("Lead successfully tracked!");

    } else {

        console.log("Failed to track lead!");

    }

};

xhr.onerror = function() {

    console.error("Error tracking lead");

};

xhr.send();

}

window.onload = function() {

executeImpressionApi();

};

</script>
                `

  const handleOpenReferralLink = (referralLink: string) => {
    refetch()
    setTriedTesting(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {buttonVariant === 'link' ? (
          <Button
            variant='link'
            className='text-shark-sm font-semibold text-primary-blue'
            size='sm'
          >
            Add Partner
          </Button>
        ) : (
          <Button variant='primary' className='text-shark-sm font-bold'>
            Add Partner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        hideCloseBtn
        className='m-0 h-screen w-screen max-w-none overflow-y-auto rounded-none bg-[#F9FAFB] p-0'
      >
        <div className='w-full overflow-y-scroll'>
          <div className='hide-scrollbar relative mx-auto w-full max-w-[700px] overflow-y-scroll py-8'>
            <div className='px-4'>
              <DialogClose>
                <Button variant={'link'}>
                  {' '}
                  <ArrowLeft /> Back
                </Button>
              </DialogClose>

              <h1 className='mb-4 text-shark-lg font-bold text-[#2A3241]'>
                Invite Partners
              </h1>

              {/* Add a Partner */}
              <div className='mb-5'>
                <h2 className='mb-1 text-shark-sm font-semibold text-[#414651]'>
                  Add a Partner
                </h2>
                <p className='mb-2 text-shark-sm text-[#535862]'>
                  Enter information about this section
                </p>
                <Select onValueChange={handlePartnerChange}>
                  <SelectTrigger className='w-full rounded-md border'>
                    <SelectValue placeholder='Select a partner organization' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value='loading'>Loading...</SelectItem>
                    ) : (
                      data?.content.map((item: any) => (
                        <SelectItem
                          key={item.partnerOrganizationId}
                          value={item.partnerOrganizationId}
                        >
                          {item.organizationName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <hr className='my-4 bg-[#E9EAEB]' />

              {/* Select Program */}
              <div className='mb-5 max-h-[300px] overflow-y-scroll'>
                <h2 className='mb-1 text-shark-sm font-semibold text-[#414651]'>
                  Select Program
                </h2>
                <p className='mb-2 text-shark-sm text-[#535862]'>
                  Enter information here about this section
                </p>
                {campaignId ? (
                  <>
                    <div className='my-5 flex items-center gap-2'>
                      <Checkbox
                        id={'prog'}
                        defaultChecked
                        // className='bg-primary-blue'
                      />
                      <div>
                        <label
                          htmlFor='earlyBird'
                          className='mb-1 cursor-pointer text-shark-sm font-medium text-[#414651]'
                        >
                          {programName}
                        </label>
                        <p className=' line-clamp-1 overflow-hidden overflow-ellipsis text-shark-sm text-[#535862]'>
                          {description}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  allPrograms?.campaignDetails.map((prog: any) => {
                    return (
                      <div
                        key={prog.id}
                        className='my-5 flex items-center gap-2'
                      >
                        <Checkbox
                          id={prog?.id}
                          checked={selectedProgram === prog}
                          // className='bg-primary-blue'
                          onClick={() => setSelectedProgram(prog)}
                        />
                        <div>
                          <label
                            htmlFor='earlyBird'
                            className='mb-1 cursor-pointer text-shark-sm font-medium text-[#414651]'
                          >
                            {prog?.programName}
                          </label>
                          <p className=' line-clamp-1 overflow-hidden overflow-ellipsis text-shark-sm text-[#535862]'>
                            {prog?.description}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <hr className='my-4 bg-[#E9EAEB]' />

              {/* Invitation Message */}
              <div className='mb-5'>
                <h2 className='mb-1 text-shark-sm font-semibold text-[#414651]'>
                  Invitation Message
                </h2>
                <p className='mb-2 text-shark-sm text-[#535862]'>
                  Enter information here about this section
                </p>
                <Textarea
                  placeholder='Add a personal message to your invitation'
                  className='mt-5 h-24 resize-none'
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={maxCharacters}
                />
                <p className='mt-1 text-xs text-gray-500'>
                  {remainingCharacters} characters left
                </p>
              </div>
              <hr className='my-4 bg-[#E9EAEB]' />
              {/* Copy Code Snippet */}
              <div className='mb-5'>
                <h2 className='mb-1 text-shark-sm font-semibold text-[#414651]'>
                  Copy Code Snippet
                </h2>
                <p className='mb-2 text-shark-sm text-[#535862]'>
                  Enter information here about this section
                </p>

                {(referralCode || selectedProgram?.referralCode) && (
                  <div className='relative overflow-hidden rounded-md border bg-gray-50'>
                    <CodeBlock
                      language='js'
                      filename='referralCode.jsx'
                      highlightLines={[9, 13, 14, 18]}
                      code={script}
                    />
                    <Button
                      variant='ghost'
                      size='sm'
                      className='absolute right-2 top-2 border bg-white shadow-sm'
                      onClick={() => handleCopy(script)}
                    >
                      {copied ? (
                        <Check className='mr-1 h-4 w-4' />
                      ) : (
                        <Copy className='mr-1 h-4 w-4' />
                      )}
                      Copy
                    </Button>
                  </div>
                )}
              </div>

              {/* Note */}
              <Alert className='mb-6 border border-[#E5E9EB] bg-[#F6F8F9]'>
                <Info className='h-4 w-4 text-gray-500' />
                <div className='ml-2'>
                  <p className='text-shark-sm font-semibold'>Please note</p>
                  <AlertDescription className='mt-1 text-shark-sm  text-[#5B6871]'>
                    SharedomJS is implemented on your website and used to track
                    referral sign-ups.
                    <br />
                    It makes sure that referral signups are attributed to
                    correct Partner
                  </AlertDescription>
                  <Button
                    variant='link'
                    className='mt-1 h-auto p-0 text-xs text-blue-600'
                  >
                    Learn more
                  </Button>
                </div>
              </Alert>

              <div className='my-4 flex flex-col'>
                <Label htmlFor='input'>Enter Your Website</Label>
                <div className='mt-3 flex items-center gap-4'>
                  {/* Input with loader inside */}
                  <div className='relative w-full'>
                    {statusLoading && (
                      <div className='absolute left-2 top-1/2 -translate-y-1/2'>
                        <svg
                          aria-hidden='true'
                          className='h-5 w-5 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539...'
                            fill='currentFill'
                          />
                        </svg>
                      </div>
                    )}
                    <Input
                      id='input'
                      value={referralLink}
                      disabled
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder='e.g. https://example.com'
                      className={`${statusLoading ? 'pl-10' : ''}`} // space for spinner
                    />
                  </div>

                  {/* Test Now button */}
                  <Button
                    disabled={
                      !selectedPartner ||
                      (!selectedProgram && !Boolean(campaignId)) ||
                      isTestedCampaign?.success
                    }
                    onClick={() =>
                      handleOpenReferralLink(
                        referralLink
                          ? referralLink
                          : selectedProgram?.referralLink
                      )
                    }
                    className='bg-[#83C413] text-white hover:bg-[#83C413]'
                  >
                    {isTestedCampaign?.success ? 'Test Successful' : 'Test Now'}
                  </Button>
                </div>
              </div>

              {!statusLoading && triedTesting && (
                <Alert className='mb-6 bg-transparent'>
                  <AlertCircle
                    className='h-4 w-4'
                    stroke={isTestedCampaign?.success ? '#28A745' : '#DC3545'}
                  />
                  <AlertTitle
                    className={cn(
                      '',
                      isTestedCampaign?.success
                        ? 'text-[#28A745]'
                        : 'text-[#DC3545]'
                    )}
                  >
                    <span className=''> Result: </span>{' '}
                    {isTestedCampaign?.success ? 'Success' : 'Failure'}
                  </AlertTitle>
                  <AlertDescription
                    className={cn(
                      '',
                      isTestedCampaign?.success
                        ? 'text-[#28A745]'
                        : 'text-[#DC3545]'
                    )}
                  >
                    {isTestedCampaign?.success
                      ? 'Great! Required tracking script is successfully loaded on this page'
                      : 'Oops! Required script is missing. Please check your HTML setup'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className='flex items-center justify-end'>
                {/* <Button
                  disabled={
                    !selectedPartner ||
                    (!selectedProgram && !Boolean(campaignId)) ||
                    isTestedCampaign?.tested
                  }
                  onClick={() =>
                    handleOpenReferralLink(
                      referralLink
                        ? referralLink
                        : selectedProgram?.referralLink
                    )
                  }
                  className=' bg-[#83C413]  text-white hover:bg-[#83C413]'
                >
                  {isTestedCampaign?.tested ? 'Test Successfull' : 'Test Now'}
                </Button> */}
                <div className='flex gap-2'>
                  <DialogClose>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <Button
                    variant={
                      !selectedPartner ||
                      (!selectedProgram && !Boolean(campaignId)) ||
                      !isTestedCampaign?.success
                        ? 'disable'
                        : 'primary'
                    }
                    className={
                      !selectedPartner ||
                      (!selectedProgram && !Boolean(campaignId)) ||
                      !isTestedCampaign?.success
                        ? 'disabled:pointer-events-auto disabled:cursor-not-allowed'
                        : ''
                    }
                    onClick={handleSendInvitation}
                    disabled={
                      !selectedPartner ||
                      (!selectedProgram && !Boolean(campaignId)) ||
                      !isTestedCampaign?.success
                    }
                    loading={mutation.isPending}
                  >
                    Share now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReferralAddPartner
