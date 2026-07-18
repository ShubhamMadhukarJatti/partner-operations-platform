// 'use client'

// import { useCallback, useEffect, useRef, useState } from 'react'
// import Link from 'next/link'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { OrganizationType } from '@/types'
// import { toast } from 'sonner'

// import { updateChatMessages } from '@/lib/actions/inbox'
// import { getCollaborationDetailsById } from '@/lib/db/collaboration'
// import { getChatMessages } from '@/lib/db/inbox'
// import { getCurrentOrganization } from '@/lib/db/organization'
// import { Button } from '@/components/ui/button'
// import { ImageFallback } from '@/components/shared/image-with-fallback'

// import { StatusIndication } from '../../_components/status-indicator'
// import { QuestionsPopOver } from './ask-question'
// import ChatUI from './chat-ui'
// import { MessageInput } from './message-input'

// function ChatScreen({ activeMessageId }: { activeMessageId: number }) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const referralCode = searchParams.get('referralCode')

//   const [chatMessages, setChatMessages] = useState<any[] | null>(null)

//   const [collabDetails, setCollabDetails] = useState<any>(null)
//   const chatBoxRef = useRef<HTMLDivElement>(null)

//   const [currentOrg, setCurrentOrg] = useState<OrganizationType | null>(null)
//   const [referralData, setReferralData] = useState<any>()

//   const fetchReferralCodeData = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `/api/get-campaign-by-referral-code?referralCode=${referralCode}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       )

//       if (!response.ok) {
//         throw new Error(`Error Error fetching Referral Campaign Details`)
//       }

//       const data = await response.json()
//       setReferralData(data)
//       console.log('REFERRAL CAMPAIGN DATA:::', { data })
//     } catch (error: any) {
//       console.log(`ERROR fetchReferralCodeData`, error)
//       showCustomToast('Error', 'Error fetching Referral Campaign Details', 'error', 5000)
//     }
//   }, [referralCode])

//   const fetchCurrentOrg = useCallback(async () => {
//     const [currentOrganization, messagedData, collaboration] =
//       await Promise.all([
//         getCurrentOrganization(),
//         getChatMessages(activeMessageId),
//         getCollaborationDetailsById(activeMessageId)
//       ])
//     setChatMessages(messagedData)
//     setCollabDetails(collaboration)
//     setCurrentOrg(currentOrganization)
//   }, [])

//   useEffect(() => {
//     const sendMessage = async () => {
//       // await updateChatMessages({
//       //   chatRoomId: collabDetails?.id,
//       //   query: `referral-program:${referralCode}`,
//       //   linkerId: '-1',
//       //   linkerType: 'EMPTY',
//       //   flag:
//       //     currentOrg?.id === collabDetails?.senderOrganizationId
//       //       ? 'SENDER'
//       //       : 'RECEIVER'
//       // })

//       const data = await getChatMessages(activeMessageId)
//       setChatMessages([...data])
//     }
//     if (
//       collabDetails &&
//       collabDetails?.senderOrganizationId &&
//       referralCode &&
//       currentOrg &&
//       currentOrg?.id
//     ) {
//       sendMessage()
//     }
//   }, [collabDetails, referralCode, currentOrg])

//   useEffect(() => {
//     fetchCurrentOrg()
//     return () => {
//       setChatMessages(null)
//       setCollabDetails(null)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     if (referralCode) {
//       fetchReferralCodeData()
//     }
//   }, [referralCode, fetchReferralCodeData])

//   useEffect(() => {
//     if (referralData && referralData?.id && currentOrg && currentOrg?.id) {
//       sendReferralDataa()
//     }
//   }, [referralData, referralData?.id, currentOrg, currentOrg?.id])

//   const sendReferralDataa = async () => {
//     const createPayload = {
//       partnerId: currentOrg?.id || '',
//       partnerOrganizationName: currentOrg?.name || ''
//     }

//     const createCamPaign = await fetch(
//       `/api/add-partner-referral-campaign?id=${referralData?.id}`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json-patch+json'
//         },
//         body: JSON.stringify(createPayload)
//       }
//     )

//     if (!createCamPaign.ok) {
//       throw new Error('Failed to createCamPaign')
//     }

//     await createCamPaign.json()
//   }

//   const getMessages = async () => {
//     let data = await getChatMessages(activeMessageId)
//     setChatMessages(data)
//   }

//   useEffect(() => {
//     chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [chatMessages])

//   return (
//     <section className=' w-full p-6 '>
//       <div className='flex w-full items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <div className='flex items-center'>
//             <ImageFallback
//               src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${currentOrg?.id === collabDetails?.senderOrganizationId ? collabDetails?.receiverOrganizationId : collabDetails?.senderOrganizationId}`}
//               width={200}
//               height={200}
//               alt={''}
//               className='size-12 rounded-full'
//             />
//             <h3 className='text-xl font-medium'>
//               {currentOrg?.id === collabDetails?.senderOrganizationId
//                 ? collabDetails?.receiverOrganizationName
//                 : collabDetails?.senderOrganizationName}
//             </h3>
//           </div>

//           <StatusIndication status={collabDetails?.status} />
//         </div>
//         <div>
//           <Link href={`/dashboard/${collabDetails?.id}`}>
//             <Button variant={'link'}>View Proposal</Button>
//           </Link>
//           <Button variant={'link'}>Schedule a meeting</Button>
//         </div>
//       </div>

//       <div className='relative my-6 flex h-[80vh] w-full flex-col rounded-lg border'>
//         {collabDetails?.status === 'PENDING' && (
//           <div className='mx-6 my-4 flex self-center rounded-md bg-[#FCF3CC] px-6 py-3'>
//             <p className='font-medium text-[#A15C07]'>
//               You can’t send message before your proposal is accepted. But you
//               can reply to the messages you received for clarifications.
//             </p>
//           </div>
//         )}

//         {chatMessages && currentOrg && collabDetails && (
//           <ChatUI
//             chatBoxRef={chatBoxRef}
//             getMessages={getMessages}
//             chatMessages={chatMessages}
//             currentOrg={currentOrg}
//             userType={
//               currentOrg?.id === collabDetails?.senderOrganizationId
//                 ? 'SENDER'
//                 : 'RECEIVER'
//             }
//             collabDetails={collabDetails}
//           />
//         )}
//         <div className='absolute bottom-5 flex self-center '>
//           {/* <QuestionsPopOver /> */}
//         </div>
//         {collabDetails && collabDetails?.status !== 'PENDING' && (
//           <MessageInput
//             // referralCode={referralCode as string}
//             chatRoomId={collabDetails?.id}
//             updateMessages={getMessages}
//             userType={
//               currentOrg?.id === collabDetails.senderOrganizationId
//                 ? 'SENDER'
//                 : 'RECEIVER'
//             }
//           />
//         )}
//       </div>
//     </section>
//   )
// }

// export default ChatScreen

import React from 'react'

import { showCustomToast } from '@/components/custom-toast'

const ChatScreen = () => {
  return <div>ChatScreen</div>
}

export default ChatScreen
