import React, { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk'
import { MicOffIcon } from 'lucide-react'
import ReactPlayer from 'react-player'

import { cn } from '@/lib/utils'

// import { nameTructed } from '../../utils/helper'

function ParticipantView({ participantId }: any) {
  const { displayName, webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId)
  const micRef = useRef<any>(null)
  const mMeeting = useMeeting()
  //   const isPresenting = mMeeting?.isPresenting

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream()
        mediaStream.addTrack(micStream.track)
        micRef.current.srcObject = mediaStream
        micRef.current
          .play()
          .catch((error: any) =>
            console.error('videoElem.current.play() failed', error)
          )
      } else {
        micRef.current.srcObject = null
      }
    }
  }, [micStream, micOn])
  const webcamMediaStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream()
      mediaStream.addTrack(webcamStream.track)
      return mediaStream
    }
  }, [webcamStream, webcamOn])
  return (
    <div
      className={` video-cover relative  h-full w-full overflow-hidden rounded-lg bg-[#101828]`}
    >
      <div className='absolute bottom-2  left-2  flex items-center justify-center rounded-md p-2 transition-all duration-200 ease-linear '>
        {!micOn ? (
          <>
            <MicOffIcon className='size-5 text-xs text-white' />
          </>
        ) : (
          <></>
        )}
      </div>
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          //
          playsinline // very very imp prop
          playIcon={<></>}
          //
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          width={'100%'}
          height={'100%'}
          url={webcamMediaStream}
          onError={(err) => {
            console.log(err, 'participant video error')
          }}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <div className={` flex  items-center justify-center rounded-full `}>
            <Image
              src='/icons/logo.svg'
              className=' mr-2.5 rounded-full '
              width={28}
              height={28}
              alt=''
            />
          </div>
        </div>
      )}
    </div>
  )
}
export function ParticipantsViewer({ isPresenting, sideBarMode }: any) {
  const mMeeting = useMeeting()

  const participants = isPresenting
    ? [...mMeeting?.participants.keys()].slice(0, 6)
    : [...mMeeting?.participants.keys()]

  //   const isXStoSM = theme.breakpoints.between('xs', 'sm')
  const isMobile = window.matchMedia(
    'only screen and (max-width: 768px)'
  ).matches

  const perRow =
    isMobile || isPresenting
      ? participants.length < 4
        ? 1
        : participants.length < 9
          ? 2
          : 3
      : participants.length < 5
        ? 2
        : participants.length < 7
          ? 3
          : participants.length < 9
            ? 4
            : participants.length < 10
              ? 3
              : participants.length < 11
                ? 4
                : 4
  return (
    <div
      className={cn(
        'mx-16 my-3.5 flex flex-grow  items-center justify-center rounded-xl  ',
        {
          'mr-4': sideBarMode
        }
      )}
    >
      <div className='flex h-full w-full flex-col'>
        {Array.from(
          { length: Math.ceil(participants.length / perRow) },
          (_, i) => {
            return (
              <div
                key={`row_${i}`}
                className={`flex flex-1 ${
                  isPresenting
                    ? participants.length === 1
                      ? 'items-start justify-start'
                      : 'items-center justify-center'
                    : 'items-center justify-center'
                }`}
              >
                {participants
                  .slice(i * perRow, (i + 1) * perRow)
                  .map((participantId) => {
                    return (
                      <div
                        key={`participant_${participantId}`}
                        className='h-full w-full overflow-hidden'
                        // className={`flex flex-1 ${
                        //   isPresenting
                        //     ? participants.length === 1
                        //       ? 'md:h-34 md:w-32 xl:h-48 xl:w-52 '
                        //       : participants.length === 2
                        //         ? 'md:w-36 xl:w-56'
                        //         : 'md:w-32 xl:w-48'
                        //     : 'w-full'
                        // } h-full items-center justify-center ${
                        //   participants.length === 1
                        //     ? 'md:max-w-7xl 2xl:max-w-[1480px] '
                        //     : 'md:max-w-lg 2xl:max-w-2xl'
                        // } overflow-clip  p-1`}
                      >
                        <ParticipantView participantId={participantId} />
                      </div>
                    )
                  })}
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
