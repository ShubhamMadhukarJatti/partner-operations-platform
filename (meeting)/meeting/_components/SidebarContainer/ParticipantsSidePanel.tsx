import React, { useMemo } from 'react'
import { Avatar } from '@mui/material'
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk'
import { Hand, Mic, MicOff, Video, VideoOff } from 'lucide-react'

import { nameTructed } from '../helper'

function ParticipantListItem({ participantId, raisedHand, pId }: any) {
  const { micOn, webcamOn, displayName, isLocal } =
    useParticipant(participantId)

  return (
    <div
      key={`participant_${participantId}`}
      className='m-2 mb-0 mt-2 rounded-lg bg-gray-700 p-2'
    >
      <div className='relative flex flex-1 items-center justify-center'>
        <Avatar variant={'rounded'}>{displayName?.charAt(0)}</Avatar>
        <div className='ml-2 mr-1 flex flex-1'>
          <p className='overflow-hidden overflow-ellipsis whitespace-pre-wrap text-base text-white'>
            {isLocal ? 'You' : nameTructed(displayName)}
          </p>
        </div>
        {raisedHand && (
          <div className='m-1 flex items-center justify-center p-1'>
            <Hand className='size-5' />
          </div>
        )}
        <div className='m-1 p-1'>
          {micOn ? <Mic className='size-5' /> : <MicOff className='size-5' />}
        </div>
        <div className='m-1 p-1'>
          {webcamOn ? (
            <Video className='size-5' />
          ) : (
            <VideoOff className='size-5' />
          )}
        </div>
      </div>
    </div>
  )
}

export function ParticipantSidePanel({
  panelHeight,
  raisedHandsParticipants
}: any) {
  const mMeeting = useMeeting()
  const participants = mMeeting.participants

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()]

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }: any) => rPID === pID
        ) === -1
    )

    const raisedSorted = raisedHandsParticipants.sort((a: any, b: any) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1
      }
      return 0
    })

    const combined = [
      ...raisedSorted.map(({ participantId: p }: any) => ({
        raisedHand: true,
        participantId: p
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p }))
    ]

    return combined
  }, [raisedHandsParticipants, participants])

  const filterParticipants = (
    sortedRaisedHandsParticipants: any,
    participants: unknown
  ) => sortedRaisedHandsParticipants

  const part = useMemo(
    () => filterParticipants(sortedRaisedHandsParticipants, participants),

    [sortedRaisedHandsParticipants, participants]
  )

  return (
    <div
      className={`bg-gray-750 flex w-full flex-col overflow-y-auto `}
      style={{ height: panelHeight }}
    >
      <div
        className='flex flex-1 flex-col'
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index]
          return (
            <div key={`participant_${peerId}`}>
              <ParticipantListItem
                participantId={peerId}
                raisedHand={raisedHand}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
