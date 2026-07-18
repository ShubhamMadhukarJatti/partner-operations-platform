'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MeetingProvider } from '@videosdk.live/react-sdk'

import { JoiningScreen } from './_components/JoiningScreen'
import { LeaveScreen } from './_components/LeavingScreen'
import { MeetingContainer } from './_components/MeetingContainer'

interface Participant {
  participantId: string
  raisedHandOn: number
}

function MeetingAppContainer({
  meetingId: id,
  userId
}: {
  meetingId: string
  userId: string
}) {
  const [token, setToken] = useState<string>('')
  const [meetingId, setMeetingId] = useState<string>(id)
  const [participantName, setParticipantName] = useState<string>('test')
  const [micOn, setMicOn] = useState<boolean>(true)
  const [webcamOn, setWebcamOn] = useState<boolean>(true)
  const [selectedMic, setSelectedMic] = useState<{ id: string | null }>({
    id: null
  })
  const [selectedWebcam, setSelectedWebcam] = useState<{ id: string | null }>({
    id: null
  })
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<
    string | null
  >(selectedWebcam.id)
  const [selectMicDeviceId, setSelectMicDeviceId] = useState<string | null>(
    selectedMic.id
  )
  const [isMeetingStarted, setMeetingStarted] = useState<boolean>(false)
  const [isMeetingLeft, setIsMeetingLeft] = useState<boolean>(false)
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<
    Participant[]
  >([])

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<Participant[]>()

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [
        ...(raisedHandsParticipantsRef?.current || [])
      ]

      const newItem: Participant = {
        participantId,
        raisedHandOn: new Date().getTime()
      }

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      )

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem)
      } else {
        raisedHandsParticipants[participantFound] = newItem
      }

      setRaisedHandsParticipants(raisedHandsParticipants)
    }

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants
    }, [raisedHandsParticipants])

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [
        ...(raisedHandsParticipantsRef.current || [])
      ]

      const now = new Date().getTime()

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return (
          parseInt(raisedHandOn.toString()) + 15000 > parseInt(now.toString())
        )
      })

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted)
      }
    }

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000)

      return () => {
        clearInterval(interval)
      }
    }, [])

    return { participantRaisedHand }
  }

  return (
    <>
      {isMeetingStarted ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: participantName,
            participantId: userId,

            debugMode: true
          }}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingContainer
            onMeetingLeave={() => {
              setToken('')
              setMeetingId('')
              setWebcamOn(false)
              setMicOn(false)
              setMeetingStarted(false)
            }}
            setIsMeetingLeft={setIsMeetingLeft}
            selectedMic={selectedMic}
            selectedWebcam={selectedWebcam}
            selectWebcamDeviceId={selectWebcamDeviceId}
            setSelectWebcamDeviceId={setSelectWebcamDeviceId}
            selectMicDeviceId={selectMicDeviceId}
            setSelectMicDeviceId={setSelectMicDeviceId}
            useRaisedHandParticipants={useRaisedHandParticipants}
            raisedHandsParticipants={raisedHandsParticipants}
            micEnabled={micOn}
            webcamEnabled={webcamOn}
          />
        </MeetingProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          meetingId={id}
          onClickStartMeeting={() => {
            setMeetingStarted(true)
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  )
}

export default MeetingAppContainer
