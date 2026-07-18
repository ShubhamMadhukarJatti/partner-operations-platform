'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useMeeting, usePubSub } from '@videosdk.live/react-sdk'

import { showCustomToast } from '@/components/custom-toast'

// import { BottomBar } from "../BottomBar";
// import { SidebarConatiner } from "../SidebarContainer/SidebarContainer";
// import { ParticipantsViewer } from "./ParticipantView";
// import { PresenterView } from "./PresenterView";
// import { useSnackbar } from "notistack";
// import { nameTructed, trimSnackBarText } from "../../utils/helper";
// import useResponsiveSize from "../../utils/useResponsiveSize";
// import WaitingToJoin from "../WaitingToJoin";
// import useWindowSize from "../../utils/useWindowSize";
import useWindowSize from '../[meetingId]/utils'
import { BottomBar } from './BottomBar'
import { ParticipantsViewer } from './MeetingContainer/ParticipantsViewer'
import { SidebarConatiner } from './SidebarContainer/SidebarContainer'

export const sideBarModes = {
  PARTICIPANTS: 'PARTICIPANTS',
  CHAT: 'CHAT'
}

export function MeetingContainer({
  onMeetingLeave,
  setIsMeetingLeft,
  selectedMic,
  selectedWebcam,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId,
  useRaisedHandParticipants,
  raisedHandsParticipants,
  micEnabled,
  webcamEnabled
}: any) {
  const [containerHeight, setContainerHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const mMeetingRef = useRef<any>()
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState(true)
  const containerRef = useRef<any>()

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight)
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth)

    window.addEventListener('resize', ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight)
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth)
    })
  }, [])

  const { participantRaisedHand } = useRaisedHandParticipants()

  const _handleMeetingLeft = () => {
    setIsMeetingLeft(true)
  }

  // function onParticipantJoined(participant: any) {
  //   console.log(' onParticipantJoined', participant)
  // }
  //   function onParticipantLeft(participant) {
  //     // console.log(" onParticipantLeft", participant);
  //   }
  //   const onSpeakerChanged = (activeSpeakerId) => {
  //     // console.log(" onSpeakerChanged", activeSpeakerId);
  //   };
  //   function onPresenterChanged(presenterId) {
  //     // console.log(" onPresenterChanged", presenterId);
  //   }
  //   function onMainParticipantChanged(participant) {
  //     // console.log(" onMainParticipantChanged", participant);
  //   }
  //   function onEntryRequested(participantId, name) {
  //     // console.log(" onEntryRequested", participantId, name);
  //   }
  function onEntryResponded({ participantId, name }: any) {
    console.log(' onEntryResponded', participantId, name)
    // if (mMeetingRef.current?.localParticipant?.id === participantId) {
    //   if (name === 'allowed') {
    //     setLocalParticipantAllowedJoin(true)
    //   } else {
    //     setLocalParticipantAllowedJoin(false)
    //     setTimeout(() => {
    //       _handleMeetingLeft()
    //     }, 3000)
    //   }
    // }
  }
  //   function onRecordingStarted() {
  //     // console.log(" onRecordingStarted");
  //   }
  //   function onRecordingStopped() {
  //     // console.log(" onRecordingStopped");
  //   }
  //   function onChatMessage(data) {
  //     // console.log(" onChatMessage", data);
  //   }
  async function onMeetingJoined() {
    // console.log("onMeetingJoined");
    const { changeWebcam, changeMic, muteMic, disableWebcam } =
      mMeetingRef.current

    if (webcamEnabled && selectedWebcam.id) {
      await new Promise<void>((resolve) => {
        disableWebcam()
        setTimeout(() => {
          changeWebcam(selectedWebcam.id)
          resolve()
        }, 500)
      })
    }

    if (micEnabled && selectedMic.id) {
      await new Promise<void>((resolve) => {
        muteMic()
        setTimeout(() => {
          changeMic(selectedMic.id)
          resolve()
        }, 500)
      })
    }
  }
  function onMeetingLeft() {
    // console.log("onMeetingLeft");
    onMeetingLeave()
  }
  //   const onLiveStreamStarted = (data) => {
  //     // console.log("onLiveStreamStarted example", data);
  //   };
  //   const onLiveStreamStopped = (data) => {
  //     // console.log("onLiveStreamStopped example", data);
  //   };

  //   const onVideoStateChanged = (data) => {
  //     // console.log("onVideoStateChanged", data);
  //   };
  //   const onVideoSeeked = (data) => {
  //     // console.log("onVideoSeeked", data);
  //   };

  //   const onWebcamRequested = (data) => {
  //     // console.log("onWebcamRequested", data);
  //   };
  //   const onMicRequested = (data) => {
  //     // console.log("onMicRequested", data);
  //   };
  //   const onPinStateChanged = (data) => {
  //     // console.log("onPinStateChanged", data);
  //   };

  const mMeeting = useMeeting({
    // onParticipantJoined,
    // onParticipantLeft,
    // onSpeakerChanged,
    // onPresenterChanged,
    // onMainParticipantChanged,
    // onEntryRequested,
    onEntryResponded,
    // onRecordingStarted,
    // onRecordingStopped,
    // onChatMessage,
    onMeetingJoined,
    onMeetingLeft
    // onLiveStreamStarted,
    // onLiveStreamStopped,
    // onVideoStateChanged,
    // onVideoSeeked,
    // onWebcamRequested,
    // onMicRequested,
    // onPinStateChanged,
  })

  useEffect(() => {
    mMeetingRef.current = mMeeting
  }, [mMeeting])

  const isPresenting = mMeeting.presenterId ? true : false

  const bottomBarHeight = 60
  const [sideBarMode, setSideBarMode] = useState(null)

  usePubSub('RAISE_HAND', {
    onMessageReceived: (data) => {
      const localParticipantId = mMeeting?.localParticipant?.id

      const { senderId, senderName } = data

      const isLocal = senderId === localParticipantId

      new Audio(`https://static.videosdk.live/prebuilt/notification.mp3`).play()

      showCustomToast(
        'Hand Raised',
        `${isLocal ? 'You' : 'nameTructed(senderName, 15)'} raised hand 🖐🏼`,
        'info',
        5000
      )

      participantRaisedHand(senderId)
    }
  })

  usePubSub('CHAT', {
    onMessageReceived: (data) => {
      const localParticipantId = mMeeting?.localParticipant?.id

      const { senderId, senderName, message } = data

      const isLocal = senderId === localParticipantId

      if (!isLocal) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play()

        showCustomToast(
          'New Message',
          `${isLocal ? 'You' : 'nameTructed(senderName, 15)'} says: ${message}`,
          'info',
          5000
        )
      }
    }
  })
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const isMobile = window.matchMedia(
    'only screen and (max-width: 768px)'
  ).matches

  return (
    <div ref={containerRef} className='  flex h-full flex-col  '>
      {typeof localParticipantAllowedJoin === 'boolean' ? (
        localParticipantAllowedJoin ? (
          <div className='flex h-full flex-col'>
            <div className={`  flex  flex-1 flex-row rounded-xl  `}>
              <div className={`flex  flex-1 `}>
                {isPresenting && isMobile ? null : (
                  <ParticipantsViewer
                    isPresenting={isPresenting}
                    sideBarMode={sideBarMode}
                  />
                )}
              </div>

              <SidebarConatiner
                height={containerHeight}
                setSideBarMode={setSideBarMode}
                sideBarMode={sideBarMode}
                raisedHandsParticipants={raisedHandsParticipants}
              />
            </div>

            <BottomBar
              bottomBarHeight={bottomBarHeight}
              sideBarMode={sideBarMode}
              setSideBarMode={setSideBarMode}
              setIsMeetingLeft={setIsMeetingLeft}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
            />
          </div>
        ) : (
          <></>
        )
      ) : (
        <>
          {/* !mMeeting.isMeetingJoined && <WaitingToJoin /> */} waiting to join
          here
        </>
      )}
    </div>
  )
}
