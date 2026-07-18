'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { CollaborationType, OrganizationType } from '@/types'
import { ChevronDown, CircleAlert, LucideCopy } from 'lucide-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'

import {
  getCollaborationsByReceiver,
  getCollaborationsBySender
} from '@/lib/db/collaboration'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
// import { getCurrentOrganization } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// import { Logo } from '@/components/icons/logo'
// Removed unused import - using standard li element instead

import Analytics from '../../_components/analytics'
import Settings from '../../_components/settings'

import '../../index.css'

import { showCustomToast } from '@/components/custom-toast'
import VideoCard from '@/app/(app)/(dashboard-pages)/getting-started/_components/VideoCard'

function ReferralCodeDetails() {
  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType
  const router = useRouter()
  const params: { referralCode: string } = useParams()
  const [referralData, setReferralData] = useState<any>()
  const [activePartners, setActivePartners] = useState<
    CollaborationType[] | null
  >(null)
  const [selectSetUp, setSelectSetUp] = useState('')
  const codeRef = useRef(null)

  const fetchReferralCodeData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/get-campaign-by-referral-code?referralCode=${params?.referralCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.log({ fetchReferralCodeData: response })
        throw new Error(`Error Error fetching Referral Campaign Details`)
      }

      const data = await response.json()
      setReferralData(data)
    } catch (error: any) {
      console.log(`ERROR fetchReferralCodeData`, error)
      showCustomToast(
        'Error',
        'Error fetching Referral Campaign Details',
        'error',
        5000
      )
    }
  }, [params?.referralCode])

  const fetchActivePartners = async () => {
    const [sentProposals, receivedProposals /* currentOrganization */] =
      await Promise.all([
        getCollaborationsBySender(),
        getCollaborationsByReceiver()
        // getCurrentOrganization()
      ])

    const combineProposal = [...sentProposals, ...receivedProposals]
    const onlyActiveProposals = combineProposal?.filter(
      (elem) => elem?.status === 'ACTIVE'
    )
    setActivePartners([...onlyActiveProposals])
  }

  useEffect(() => {
    if (params && params?.referralCode) {
      setTimeout(() => {
        fetchReferralCodeData()
      }, 0)
    }
  }, [params, params?.referralCode, fetchReferralCodeData])

  useEffect(() => {
    fetchActivePartners()
  }, [])

  const referralScript = `<script>

function executeImpressionApi() {

var referralCode = "${params.referralCode}";

var impressionApiUrl = "${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=" + referralCode + "&type=impression";



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

function submitForm(event) {

event.preventDefault();

var referralCode = "${params.referralCode}"; 

var name = encodeURIComponent(document.getElementById('name').value);

var email = encodeURIComponent(document.getElementById('email').value);

var phone = encodeURIComponent(document.getElementById('phone').value);

var leadApiUrl = "${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=" + referralCode + "&name=" + name + "&email=" + email + "&mobile=" + phone + "&type=lead";

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

</script>`

  const renderPopOverBtn = () => {
    if (activePartners && activePartners?.length > 0) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button className='bg-0 text-md flex gap-2 rounded bg-blue-500 px-6 text-white hover:shadow-md'>
              Send to partner{' '}
              <ChevronDown className='ml-0.5 size-4 transition duration-300 group-data-[state=open]:rotate-180' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full' alignOffset={0}>
            <ul className=''>
              {Array.isArray(activePartners) &&
                activePartners?.map(
                  (data: CollaborationType, index: number) => {
                    return (
                      <li
                        key={index}
                        onClick={() =>
                          router.push(
                            `/inbox/${data?.id}?referralCode=${params?.referralCode}`
                          )
                        }
                        className='cursor-pointer rounded-md px-4 py-2 transition-colors hover:bg-gray-100'
                      >
                        {data?.senderOrganizationId === organizationData?.id
                          ? data?.receiverOrganizationName
                          : data?.senderOrganizationName}{' '}
                        {!data?.chatAccessAllowed && '(chat is disabled)'}
                      </li>
                    )
                  }
                )}
            </ul>
          </PopoverContent>
        </Popover>
      )
    } else if (activePartners?.length === 0) {
      return (
        <Button
          disabled
          className='bg-0 text-md flex gap-2 rounded bg-blue-500 px-6 text-white hover:shadow-md'
        >
          No partner found
        </Button>
      )
    } else {
      return (
        <Button
          disabled
          className='bg-0 text-md flex gap-2 rounded bg-blue-500 px-6 text-white hover:shadow-md'
        >
          Loading...
        </Button>
      )
    }
  }

  return (
    <main className='flex shrink-0 flex-col justify-between p-4 lg:flex-row'>
      <div className='flex flex-1  flex-col gap-4 '>
        <div className='mb-2 flex shrink-0 flex-col gap-2'>
          <div className='flex flex-row flex-wrap items-center gap-2 text-sm text-[#475569]'>
            <div
              className='cursor-pointer hover:underline'
              onClick={() => router.push('/partner-programs')}
            >
              Partner Programs
            </div>
            <p>{'>'}</p>
            <div
              className='cursor-pointer hover:underline'
              onClick={() =>
                router.push('/partner-programs/create-referral-program')
              }
            >
              Referral program
            </div>
            <p>{'>'}</p>
            <p className='font-bold'>{referralData?.programName}</p>
          </div>
        </div>
        <Tabs
          defaultValue='Overview'
          className='flex max-w-5xl flex-col sm:flex-col'
        >
          <div className='sm:ml-4 sm:border-b-2'>
            <TabsList className='bg-0 flex h-min flex-row flex-wrap items-start justify-start gap-y-4'>
              <TabsTrigger
                value='Overview'
                className='flex flex-col rounded-none data-[state=active]:bg-[#F0F6FC]'
              >
                <p>Overview</p>
              </TabsTrigger>
              <TabsTrigger
                value='Analytics'
                className='flex flex-col rounded-none data-[state=active]:bg-[#F0F6FC]'
              >
                <p>Analytics</p>
              </TabsTrigger>
              <TabsTrigger
                value='Settings'
                className='flex flex-col rounded-none data-[state=active]:bg-[#F0F6FC]'
              >
                <p>Settings</p>
              </TabsTrigger>
              <TabsTrigger
                value='Integration'
                className='flex flex-col rounded-none data-[state=active]:bg-[#F0F6FC]'
              >
                <p>Integration</p>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='Overview'>
            <div className='flex w-full flex-col gap-8 p-4'>
              {/*<div className='flex w-max gap-4 rounded-xl bg-[#F3F4F6] p-4 text-[#475467]'>*/}
              {/*  <CircleAlert />*/}
              {/*  <p>*/}
              {/*    SharkdomJS is implemented on your website and used to track referral*/}
              {/*    sign-ups. <br /> It makes sure that referral signups are attributed*/}
              {/*    to correct Partner*/}
              {/*  </p>*/}
              {/*</div>*/}
              <Accordion
                type='single'
                collapsible
                defaultValue='item-0'
                className='w-full rounded-lg border-2 border-gray-200 px-6 py-4'
              >
                <AccordionItem
                  value='item-0'
                  className='rounded-2xl bg-white hover:no-underline'
                >
                  <AccordionTrigger className='flex text-xl font-semibold text-black hover:no-underline'>
                    <div className='flex flex-row items-center justify-between'>
                      <div>
                        <span className='text-xl	font-medium hover:no-underline'>
                          Complete your setup
                        </span>
                        <p className='text-base text-[#475569] hover:no-underline'>
                          Use this tailored guide to kickstart your referral
                          program effectively.
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='text-lg font-medium'>
                    <RadioGroup
                      onValueChange={(value) => setSelectSetUp(value)}
                      value={selectSetUp}
                      className='grid grid-cols-1 gap-2'
                    >
                      <Label
                        htmlFor='programSettings'
                        className='flex flex-row gap-2 rounded-md border-2 border-muted bg-popover p-4 text-base font-medium text-muted-foreground hover:bg-[#CCFBF6] hover:text-[#042F2A] peer-data-[state=checked]:bg-[#CCFBF6] peer-data-[state=checked]:text-[#042F2A] [&:has([data-state=checked])]:bg-[#CCFBF6] [&:has([data-state=checked])]:text-[#042F2A]'
                      >
                        <RadioGroupItem
                          value='PROGRAM SETTINGS'
                          id='programSettings'
                          className='peer mt-1'
                        />
                        <div className='flex flex-col'>
                          <p>Program settings</p>
                          <p>
                            Review and update program settings according to your
                            needs.
                          </p>
                        </div>
                      </Label>
                      <Label
                        htmlFor='integration'
                        className='flex flex-row gap-2 rounded-md border-2 border-muted bg-popover p-4 text-base font-medium text-muted-foreground hover:bg-[#CCFBF6] hover:text-[#042F2A] peer-data-[state=checked]:bg-[#CCFBF6] peer-data-[state=checked]:text-[#042F2A] [&:has([data-state=checked])]:bg-[#CCFBF6] [&:has([data-state=checked])]:text-[#042F2A]'
                      >
                        <RadioGroupItem
                          value='INTEGRATION'
                          id='integration'
                          className='peer mt-1'
                        />
                        <div className='flex flex-col'>
                          <p>Integration</p>
                          <p>You’ll need a developer for this step</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className='flex flex-col gap-1'>
                <label className='text-base'>Your referral link</label>
                <div className='flex  flex-col gap-5 md:flex-row'>
                  <Input
                    className='w-full rounded-lg border p-2 lg:w-7/12'
                    type='firstname'
                    name='first_name'
                    value={
                      referralData?.referralLink
                        ? referralData?.referralLink
                        : 'Loading...'
                    }
                    required
                  />
                  <div className='flex w-auto gap-6'>
                    {/* <Button className='bg-0 text-md flex gap-2 rounded bg-blue-500 px-6 text-white hover:shadow-md'>
                      Send to partner <ChevronDown size={20} />
                    </Button> */}

                    {renderPopOverBtn()}
                  </div>
                </div>
                <p className='text-xs text-[#475569]'>
                  Share this with your partner
                </p>
              </div>

              {/* <div className='flex flex-row gap-3 rounded-md border-2 border-gray-200 px-10 py-5'>
                <div className='basis-1/4 border-r border-r-gray-300 px-3'>
                  <p className='mb-2 text-sm text-[#475569]'>Partner</p>
                  <p className='text-base font-medium text-black'>
                    Partner Name
                  </p>
                </div>
                <div className='basis-1/4 border-r border-r-gray-300 px-3'>
                  <p className='mb-2 text-sm text-[#475569]'>Reward</p>
                  <p className='text-base font-medium text-black'>0</p>
                </div>
                <div className='basis-1/4 border-r border-r-gray-300 px-3'>
                  <p className='mb-2 text-sm text-[#475569]'>Commission</p>
                  <p className='text-base font-medium text-black'>
                    30%, lifetime
                  </p>
                </div>
                <div className='basis-1/4 px-3'>
                  <p className='mb-2 text-sm text-[#475569]'>Program revenue</p>
                  <p className='text-base font-medium text-black'>0</p>
                </div>
              </div> */}
              <div className='mt-5'>
                <p className='text-lg font-medium'>Partner performance</p>
                <div className='mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3'>
                  <div className='rounded-md border-2 border-gray-200 p-5'>
                    <p className='text-xs text-[#475569]'>Unique Visits</p>
                    <p className='mt-2 text-3xl'>0</p>
                  </div>
                  <div className='rounded-md border-2 border-gray-200 p-5'>
                    <p className='text-xs text-[#475569]'>Leads</p>
                    <p className='mt-2 text-3xl'>0</p>
                  </div>
                  <div className='rounded-md border-2 border-gray-200 p-5'>
                    <p className='text-xs text-[#475569]'>
                      Click-to-Signup conversion
                    </p>
                    <p className='mt-2 text-3xl'>0</p>
                  </div>
                  <div className='rounded-md border-2 border-gray-200 p-5'>
                    <p className='text-xs text-[#475569]'>Total Visits</p>
                    <p className='mt-2 text-3xl'>0</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='Analytics'>
            <Analytics />
          </TabsContent>
          <TabsContent value='Settings'>
            <Settings referralData={referralData} />
          </TabsContent>
          <TabsContent value='Integration'>
            {referralData?.organizationId === organizationData?.id && (
              <>
                <div className='mt-4 space-y-2'>
                  {/*{renderPopOverBtn()}*/}
                  {/*<Button*/}
                  {/*  onClick={() =>*/}
                  {/*    router?.push(*/}
                  {/*      `/partner-programs/referral-analytics/${params?.referralCode}`*/}
                  {/*    )*/}
                  {/*  }*/}
                  {/*  className='bg-0 text-md hover:bg-0 flex w-full gap-6 rounded-3xl border-2 border-black px-12 text-[#3662E3] hover:shadow-md'*/}
                  {/*>*/}
                  {/*  View analytics*/}
                  {/*</Button>*/}
                </div>
                <div>
                  <Tabs defaultValue='testing' className=''>
                    <TabsList className='w-max gap-4 rounded-md bg-gray-200'>
                      <TabsTrigger value='testing' className='rounded-md'>
                        Testing
                      </TabsTrigger>
                      <TabsTrigger value='production' className='rounded-md'>
                        Production
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value='testing' className='pt-4'>
                      <p className='font-medium'>
                        Start tracking website visitors
                      </p>
                      <p className='mt-2 text-sm'>
                        For accurate tracking, you need to --- step
                      </p>
                      <div className='relative mt-5 w-full rounded-lg border'>
                        <p className='border-b py-2 pl-4 font-medium'>
                          Code snippet
                        </p>
                        <pre
                          className='my-4 ml-4 h-52 overflow-auto rounded text-black'
                          ref={codeRef}
                        >
                          {referralScript}
                        </pre>
                        <div className='absolute bottom-2 right-2 gap-6'>
                          <CopyToClipboard
                            text={referralScript}
                            onCopy={() => {
                              showCustomToast(
                                'Success',
                                'code copied!',
                                'success',
                                5000
                              )
                            }}
                          >
                            <Button className='h-10 w-10 rounded-md bg-gray-200 p-0 hover:bg-gray-300'>
                              <LucideCopy color='rgb(75 85 99)' size={16} />
                            </Button>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className='my-6 rounded border bg-gray-100 py-6'>
                        <div className='flex flex-row items-start'>
                          <div className='w-16'>
                            <CircleAlert className='mx-auto' size={20} />
                          </div>
                          <div className='flex basis-4/6 flex-col'>
                            <p className='mb-2 text-sm font-medium'>
                              Please note
                            </p>
                            <p className='mb-2 text-sm text-[#475569]'>
                              SharkdomJS is implemented on your website and used
                              to track referral sign-ups. It makes sure that
                              referral signups are attributed to correct Partner
                            </p>
                            <p className='text-sm text-blue-500 hover:underline'>
                              Learn more
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value='production' className='pt-4'>
                      <p className='font-medium'>
                        Start tracking website visitors
                      </p>
                      <p className='mt-2 text-sm'>
                        For accurate tracking, you need to --- step
                      </p>
                      <div className='relative mt-5 w-full rounded-lg border'>
                        <p className='border-b py-2 pl-4 font-medium'>
                          Code snippet
                        </p>
                        <pre
                          className='my-4 ml-4 h-52 overflow-auto rounded text-black'
                          ref={codeRef}
                        >
                          {referralScript}
                        </pre>
                        <div className='absolute bottom-2 right-2 gap-6'>
                          <CopyToClipboard
                            text={referralScript}
                            onCopy={() => {
                              showCustomToast(
                                'Success',
                                'code copied!',
                                'success',
                                5000
                              )
                            }}
                          >
                            <Button className='h-10 w-10 rounded-md bg-gray-200 p-0 hover:bg-gray-300'>
                              <LucideCopy color='rgb(75 85 99)' size={16} />
                            </Button>
                          </CopyToClipboard>
                        </div>
                      </div>
                      {/* <div className='mt-10'>
                        <p className='mb-1 text-sm font-medium'>
                          Sales tracking
                        </p>
                        <p className='mb-2 text-sm'>
                          To complete the integration, you need to {'{details}'}{' '}
                          You can do this in a few ways:
                        </p>
                        <ul className='list-inside list-disc'>
                          {[1, 2, 3, 4].map((index) => {
                            return (
                              <li key={index} className='mb-1 text-sm'>
                                Step {index}
                              </li>
                            )
                          })}
                        </ul>
                      </div> */}
                      <div className='my-6 rounded border bg-gray-100 py-6'>
                        <div className='flex flex-row items-start'>
                          <div className='w-16'>
                            <CircleAlert className='mx-auto' size={20} />
                          </div>
                          <div className='flex basis-4/6 flex-col'>
                            <p className='mb-2 text-sm font-medium'>
                              Please note
                            </p>
                            <p className='mb-2 text-sm text-[#475569]'>
                              SharkdomJS is implemented on your website and used
                              to track referral sign-ups. It makes sure that
                              referral signups are attributed to correct Partner
                            </p>
                            <p className='text-sm text-blue-500 hover:underline'>
                              Learn more
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className=''>
        <VideoCard
          title='How to setup your referral program'
          videoUrl='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/discover/template/referral_program_section_intro.mp4'
          thumbnailUrl='/video.png'
        />
      </div>
    </main>
  )
}

export default ReferralCodeDetails
