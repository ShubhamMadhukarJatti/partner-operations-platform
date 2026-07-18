import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Tooltip } from '@mui/material'
import { Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import { getToken, validateMeeting } from './api'

//   import SettingDialogueBox from "./SettingDialogueBox";
//   import ConfirmBox from "./ConfirmBox";

interface JoiningScreenProps {
  participantName: string | undefined
  setParticipantName: (i: any) => void
  setMeetingId: (id: any) => void
  setToken: (token: string) => void
  setSelectedMic: (i: any) => void
  setSelectedWebcam: (i: any) => void
  onClickStartMeeting: () => void
  micEnabled: boolean
  webcamEnabled: boolean
  setWebcamOn: (cam: boolean) => void
  setMicOn: (mic: boolean) => void
  startMeeting: any
  setIsMeetingLeft: any
  meetingId: string
}

export function JoiningScreen({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  setSelectedMic,
  setSelectedWebcam,
  onClickStartMeeting,
  micEnabled,
  webcamEnabled,
  setWebcamOn,
  setMicOn,
  meetingId
}: JoiningScreenProps) {
  const [setting, setSetting] = useState('video')
  const [{ webcams, mics }, setDevices] = useState<any>({
    devices: [],
    webcams: [],
    mics: []
  })

  const [videoTrack, setVideoTrack] = useState<any>(null)

  const [dlgMuted, setDlgMuted] = useState(false)
  const [dlgDevices, setDlgDevices] = useState(false)

  const videoPlayerRef = useRef<any>()
  const popupVideoPlayerRef = useRef<any>()
  const popupAudioPlayerRef = useRef<any>()

  const videoTrackRef = useRef<any>()
  const audioTrackRef = useRef<any>()
  const audioAnalyserIntervalRef = useRef<any>()

  const [settingDialogueOpen, setSettingDialogueOpen] = useState(false)

  const [audioTrack, setAudioTrack] = useState<any>(null)

  const handleClickOpen = () => {
    setSettingDialogueOpen(true)
  }

  const handleClose = (value: any) => {
    setSettingDialogueOpen(false)
  }

  const webcamOn = useMemo(() => !!videoTrack, [videoTrack])
  const micOn = useMemo(() => !!audioTrack, [audioTrack])

  const _handleTurnOffWebcam = () => {
    const videoTrack = videoTrackRef.current

    if (videoTrack) {
      videoTrack.stop()
      setVideoTrack(null)
      setWebcamOn(false)
    }
  }
  const _handleTurnOnWebcam = () => {
    const videoTrack = videoTrackRef.current

    if (!videoTrack) {
      getDefaultMediaTracks({ mic: false, webcam: true })
      setWebcamOn(true)
    }
  }

  const _toggleWebcam = () => {
    const videoTrack = videoTrackRef.current

    if (videoTrack) {
      _handleTurnOffWebcam()
    } else {
      _handleTurnOnWebcam()
    }
  }
  const _handleTurnOffMic = () => {
    const audioTrack = audioTrackRef.current

    if (audioTrack) {
      audioTrack.stop()

      setAudioTrack(null)
      setMicOn(false)
    }
  }
  const _handleTurnOnMic = () => {
    const audioTrack = audioTrackRef.current

    if (!audioTrack) {
      getDefaultMediaTracks({ mic: true, webcam: false })
      setMicOn(true)
    }
  }
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current

    if (audioTrack) {
      _handleTurnOffMic()
    } else {
      _handleTurnOnMic()
    }
  }

  const changeWebcam = async (deviceId: string) => {
    const currentvideoTrack = videoTrackRef.current

    if (currentvideoTrack) {
      currentvideoTrack.stop()
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId }
    })
    const videoTracks = stream.getVideoTracks()

    const videoTrack = videoTracks.length ? videoTracks[0] : null

    setVideoTrack(videoTrack)
  }
  const changeMic = async (deviceId: string) => {
    const currentAudioTrack = audioTrackRef.current
    currentAudioTrack && currentAudioTrack.stop()
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId }
    })
    const audioTracks = stream.getAudioTracks()

    const audioTrack = audioTracks.length ? audioTracks[0] : null
    clearInterval(audioAnalyserIntervalRef.current)

    setAudioTrack(audioTrack)
  }

  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }: any) => {
    if (mic) {
      const audioConstraints = {
        audio: true
      }

      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints)
      const audioTracks = stream.getAudioTracks()

      const audioTrack = audioTracks.length ? audioTracks[0] : null

      setAudioTrack(audioTrack)
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId
        })
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints)
      const videoTracks = stream.getVideoTracks()

      const videoTrack = videoTracks.length ? videoTracks[0] : null
      setVideoTrack(videoTrack)
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId
        })
      }
    }
  }

  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true)
      }

      currentAudioTrack.addEventListener('mute', (ev: any) => {
        setDlgMuted(true)
      })
    }
  }

  const getDevices = async ({ micEnabled, webcamEnabled }: any) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      const webcams = devices.filter((d) => d.kind === 'videoinput')
      const mics = devices.filter((d) => d.kind === 'audioinput')

      const hasMic = mics.length > 0
      const hasWebcam = webcams.length > 0

      setDevices({ webcams, mics, devices })

      if (hasMic) {
        startMuteListener()
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    audioTrackRef.current = audioTrack

    startMuteListener()
  }, [audioTrack])

  useEffect(() => {
    videoTrackRef.current = videoTrack

    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack])

      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = videoSrcObject
        videoPlayerRef.current.play()
      }

      setTimeout(() => {
        if (popupVideoPlayerRef.current) {
          popupVideoPlayerRef.current.srcObject = videoSrcObject
          popupVideoPlayerRef.current.play()
        }
      }, 1000)
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = null
      }
      if (popupVideoPlayerRef.current) {
        popupVideoPlayerRef.current.srcObject = null
      }
    }
  }, [videoTrack, setting, settingDialogueOpen])

  useEffect(() => {
    getDevices({ micEnabled, webcamEnabled })
  }, [])

  return (
    <>
      <div className='flex  h-full flex-1 flex-col items-center  justify-center '>
        <h1 className='text-3xl font-light'>Sharkdom x Zomato</h1>
        <div className=' mt-7 flex min-w-[30rem] flex-col items-center  gap-3 rounded-xl bg-[#F3F4F6]  px-9 pb-10 pt-6 drop-shadow-md'>
          <div className='flex flex-col gap-2'>
            <p className='  text-2xl font-medium'>
              Allow camera and mic access{' '}
            </p>
            <span className='text-base text-muted-foreground'>
              Click on “Allow” to give camera and mic access
            </span>
          </div>
          <div className='relative max-h-[12rem] min-h-20 w-full max-w-[25rem] rounded-xl '>
            <video
              autoPlay
              playsInline
              muted
              ref={videoPlayerRef}
              controls={false}
              // className={'video' + ' flip'}
              className={cn(
                '  flex h-full w-full  items-center justify-center  rounded-xl bg-[#101828] object-cover  '
              )}
            />
          </div>

          <div className='flex items-center justify-center gap-4'>
            <Tooltip
              title={micOn ? 'Turn off mic' : 'Turn on mic'}
              arrow
              placement='top'
              className='size-12 rounded-full'
            >
              <Button
                onClick={() => _handleToggleMic()}
                className='rounded-full border-2 border-[#959AA0] bg-white p-0 '
                variant='ghost'
              >
                {micOn ? (
                  <Mic className='size-5 font-bold text-primary' />
                ) : (
                  <MicOff className='size-5 font-bold text-primary' />
                )}
              </Button>
            </Tooltip>
            <Tooltip
              title={webcamOn ? 'Turn off camera' : 'Turn on camera'}
              arrow
              placement='top'
              className='size-12 rounded-full'
            >
              <Button
                onClick={() => _toggleWebcam()}
                className='rounded-full border-2 border-[#959AA0] bg-white p-0 '
                variant='ghost'
                // className={classes.toggleButton}
              >
                {webcamOn ? (
                  <VideoIcon className='size-5 font-bold text-primary' />
                ) : (
                  <VideoOff className='size-5 font-bold text-primary' />
                )}
              </Button>
            </Tooltip>
          </div>

          <Button
            className='w-full border-2 border-[#1D2939] py-4 font-semibold '
            onClick={async () => {
              if (meetingId.match('\\w{4}\\-\\w{4}\\-\\w{4}')) {
                const token = await getToken()
                // const meeting = await createMeeting({ token })

                try {
                  const valid = await validateMeeting({
                    roomId: meetingId,
                    token
                  })

                  if (valid) {
                    setToken(token)
                    setMeetingId(meetingId)
                    if (videoTrack) {
                      videoTrack.stop()
                      setVideoTrack(null)
                    }
                    onClickStartMeeting()
                    // setParticipantName("");
                  } else
                    showCustomToast('Error', 'Invalid Meeting', 'error', 5000)
                } catch (error) {
                  console.log(error)
                  showCustomToast('Error', error as string, 'error', 5000)
                }
              }
            }}
            variant={'outline'}
          >
            Join Meeting
          </Button>
        </div>
      </div>
    </>
  )
}
