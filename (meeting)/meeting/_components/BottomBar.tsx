import React, { useMemo, useRef, useState } from 'react'
import { useMeeting, usePubSub } from '@videosdk.live/react-sdk'
import {
  CheckIcon,
  Clipboard,
  Hand,
  MessageSquareText,
  Mic,
  MicOff,
  Phone,
  Users,
  Video,
  VideoOff
} from 'lucide-react'

import { sideBarModes } from './MeetingContainer'
import { OutlinedButton } from './OutlineButton'

// import recordingBlink from '../animations/recording-blink.json'
// import ChatIcon from '../icons/Bottombar/ChatIcon'
// import EndIcon from '../icons/Bottombar/EndIcon'
// import MicOffIcon from '../icons/Bottombar/MicOffIcon'
// import MicOnIcon from '../icons/Bottombar/MicOnIcon'
// import ParticipantsIcon from '../icons/Bottombar/ParticipantsIcon'
// import RaiseHandIcon from '../icons/Bottombar/RaiseHandIcon'
// import RecordingIcon from '../icons/Bottombar/RecordingIcon'
// import ScreenShareIcon from '../icons/Bottombar/ScreenShareIcon'
// import WebcamOffIcon from '../icons/Bottombar/WebcamOffIcon'
// import WebcamOnIcon from '../icons/Bottombar/WebcamOnIcon'
// import useIsMobile from '../utils/useIsMobile'
// import useIsTab from '../utils/useIsTab'
// import { sideBarModes } from './MeetingContainer/MeetingContainer'
// import useIsRecording from './MeetingContainer/useIsRecording'
// import { MobileIconButton } from './MobileIconButton'
// import { OutlinedButton } from './OutlinedButton'

export function BottomBar({
  bottomBarHeight,
  sideBarMode,
  setSideBarMode,
  setIsMeetingLeft,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId
}: any) {
  const RaiseHandBTN = ({ isMobile, isTab }: any) => {
    const { publish } = usePubSub('RAISE_HAND')
    const RaiseHand = () => {
      publish('Raise Hand', { persist: false, sendOnly: [''] })
    }
    return false ? (
      <>
        {/* <MobileIconButton
        id='RaiseHandBTN'
        tooltipTitle={'Raise hand'}
        Icon={RaiseHandIcon}
        onClick={RaiseHand}
        buttonText={'Raise Hand'}
        /> */}
      </>
    ) : (
      <OutlinedButton
        onClick={RaiseHand}
        tooltip={'Raise Hand'}
        Icon={<Hand className='size-5' />}
      />
    )
  }

  const RecordingBTN = () => {
    const mMeeting = useMeeting()
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: '',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      },
      height: 64,
      width: 160
    }
    // const startRecording = mMeeting?.startRecording
    // const stopRecording = mMeeting?.stopRecording
    // const recordingState = mMeeting?.recordingState

    // const isRecording = useIsRecording()

    // const isRecordingRef = useRef(isRecording)

    // useEffect(() => {
    //   isRecordingRef.current = isRecording
    // }, [isRecording])

    // const { isRequestProcessing } = useMemo(
    //   () => ({
    //     isRequestProcessing:
    //       recordingState === Constants.recordingEvents.RECORDING_STARTING ||
    //       recordingState === Constants.recordingEvents.RECORDING_STOPPING
    //   }),
    //   [recordingState]
    // )

    const _handleClick = () => {
      //   const isRecording = isRecordingRef.current
      //   if (isRecording) {
      //     stopRecording()
      //   } else {
      //     startRecording()
      //   }
    }

    // return (
    //   <OutlinedButton
    //     Icon={RecordingIcon}
    //     onClick={_handleClick}
    //     isFocused={isRecording}
    //     tooltip={
    //       recordingState === Constants.recordingEvents.RECORDING_STARTED
    //         ? 'Stop Recording'
    //         : recordingState === Constants.recordingEvents.RECORDING_STARTING
    //           ? 'Starting Recording'
    //           : recordingState === Constants.recordingEvents.RECORDING_STOPPED
    //             ? 'Start Recording'
    //             : recordingState ===
    //                 Constants.recordingEvents.RECORDING_STOPPING
    //               ? 'Stopping Recording'
    //               : 'Start Recording'
    //     }
    //     lottieOption={isRecording ? defaultOptions : null}
    //     isRequestProcessing={isRequestProcessing}
    //   />
    // )
  }

  const SingleMicMenu = ({
    micArr,
    Icon,
    label,
    classes,
    changeMic,
    handleClose
  }: any) => {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 12,
            paddingBottom: 0
          }}
        >
          <h6
            style={{
              marginLeft: 12,
              fontSize: 14,
              color: 'yellowgreen'
            }}
          >
            {label}
          </h6>
        </div>
        {/* <MenuList
          disableRipple
          disableFocusRipple
          style={{
            backgroundColor: 'gray',
            color: 'white'
          }}
        >
          {micArr.map(({ deviceId, label }: any, index: number) => (
            <Box
              key={`mic_${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: deviceId === selectMicDeviceId && '#3F4046'
              }}
              classes={{
                root: classes.popoverHoverDark
              }}
            >
              <MenuItem
                disableRipple
                style={{
                  display: 'flex',
                  flex: 1,
                  backgroundColor: deviceId === selectMicDeviceId && '#3F4046'
                }}
                key={`mics_${deviceId}`}
                selected={deviceId === selectMicDeviceId}
                onClick={() => {
                  handleClose()
                  setSelectMicDeviceId(deviceId)
                  changeMic(deviceId)
                }}
                classes={{
                  root: classes.menuItemDark,
                  gutters: classes.menuItemGutters
                }}
              >
                {label || `Mic ${index + 1}`}
              </MenuItem>
            </Box>
          ))}
        </MenuList> */}
      </div>
    )
  }

  const MicMenu = ({
    localMicOn,
    downArrow,
    mics,
    classes,
    handleClose,
    tollTipEl,
    changeMic
  }: any) => {
    // return (
    //   <Popover
    //     container={tollTipEl.current}
    //     anchorOrigin={{
    //       vertical: isMobile || isTab ? 'bottom' : 'top',
    //       horizontal: 'center'
    //     }}
    //     transformOrigin={{
    //       vertical: isMobile || isTab ? 'top' : 'bottom',
    //       horizontal: 'center'
    //     }}
    //     anchorEl={tollTipEl.current}
    //     open={Boolean(downArrow)}
    //     onClose={handleClose}
    //   >
    //     <Box
    //       style={{
    //         backgroundColor: 'gray'
    //       }}
    //     >
    //       <SingleMicMenu
    //         micArr={mics}
    //         label={'MICROPHONE'}
    //         // Icon={MicrophoneIcon}
    //         changeMic={changeMic}
    //         classes={classes}
    //         handleClose={handleClose}
    //       />
    //     </Box>
    //   </Popover>
    // )
  }

  const MicBTN = () => {
    const mMeeting = useMeeting()
    const [mics, setMics] = useState([])
    const [downArrow, setDownArrow] = useState(false)
    const localMicOn = mMeeting?.localMicOn
    const changeMic = mMeeting?.changeMic

    const getMics = async (mGetMics: any) => {
      const mics = await mGetMics()

      mics && mics?.length && setMics(mics)
    }

    const handleClick = (event: any) => {
      setDownArrow(event.currentTarget)
    }

    // const handleClose = () => {
    //   setDownArrow(null)
    // }

    return (
      <>
        <OutlinedButton
          Icon={
            localMicOn ? (
              <Mic className='size-5' />
            ) : (
              <MicOff className='size-5' />
            )
          }
          onClick={() => {
            mMeeting.toggleMic()
          }}
          bgColor={localMicOn ? 'bg-gray-750' : 'bg-white'}
          borderColor={localMicOn && '#ffffff33'}
          isFocused={localMicOn}
          focusIconColor={localMicOn && 'white'}
          tooltip={'Toggle Mic'}
          // renderRightComponent={() => {
          //   return (
          //     <Tooltip placement='bottom' title={'Change microphone'}>
          //       <IconButton
          //         onClick={(e) => {
          //           getMics(mMeeting.getMics)
          //           handleClick(e)
          //         }}
          //         size={'small'}
          //       >
          //         <ArrowDropDownIcon
          //           fontSize={'small'}
          //           style={{
          //             color: mMeeting.localMicOn ? 'white' : 'black'
          //           }}
          //         />
          //       </IconButton>
          //     </Tooltip>
          //   )
          // }}
        />
        {/* <MicMenu
          localMicOn={mMeeting.localMicOn}
          downArrow={downArrow}
          tollTipEl={tollTipEl}
          changeMic={changeMic}
          mics={mics}
          classes={classes}
          handleClose={handleClose}
        /> */}
      </>
    )
  }

  const WebCamBTN = () => {
    const mMeeting = useMeeting()
    const [webcams, setWebcams] = useState([])
    const [webcamDownArrow, setDownArrowWebCam] = useState(false)
    const localWebcamOn = mMeeting?.localWebcamOn
    const changeWebcam = mMeeting?.changeWebcam

    const getWebcams = async (mGetWebcams: any) => {
      const webcams = await mGetWebcams()

      webcams && webcams?.length && setWebcams(webcams)
    }

    const handleClickWebCam = (event: any) => {
      setDownArrowWebCam(event.currentTarget)
    }

    // const handleCloseWebCam = () => {
    //   setDownArrowWebCam(null)
    // }

    return (
      <>
        <OutlinedButton
          Icon={
            localWebcamOn ? (
              <Video className='size-5' />
            ) : (
              <VideoOff className='size-5' />
            )
          }
          onClick={() => {
            mMeeting.toggleWebcam()
          }}
          bgColor={localWebcamOn ? 'bg-gray-750' : 'bg-white'}
          borderColor={localWebcamOn && '#ffffff33'}
          isFocused={localWebcamOn}
          focusIconColor={localWebcamOn && 'white'}
          tooltip={'Toggle Webcam'}
          // renderRightComponent={() => {
          //   return (
          //     <Tooltip placement='bottom' title={'Change webcam'}>
          //       <IconButton
          //         onClick={(e) => {
          //           getWebcams(mMeeting?.getWebcams)
          //           handleClickWebCam(e)
          //         }}
          //         size={'small'}
          //       >
          //         <ArrowDropDownIcon
          //           fontSize={'small'}
          //           style={{
          //             color: localWebcamOn ? 'white' : 'black'
          //           }}
          //         />
          //       </IconButton>
          //     </Tooltip>
          //   )
          // }}
        />
        {/* <Popover
          container={tollTipEl.current}
          anchorOrigin={{
            vertical: isMobile || isTab ? 'bottom' : 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: isMobile || isTab ? 'top' : 'bottom',
            horizontal: 'center'
          }}
          anchorEl={tollTipEl.current}
          open={Boolean(webcamDownArrow)}
          onClose={handleCloseWebCam}
        >
          <MenuList
            style={{
              backgroundColor: 'GrayText',
              color: 'white'
            }}
          >
            {webcams.map(({ deviceId, label }, index) => (
              <MenuItem
                key={`output_webcams_${deviceId}`}
                selected={deviceId === selectWebcamDeviceId}
                onClick={() => {
                  handleCloseWebCam()
                  setSelectWebcamDeviceId(deviceId)
                  changeWebcam(deviceId)
                }}
                classes={{
                  root: classes.popoverHoverDark
                }}
              >
                {label || `Webcam ${index + 1}`}
              </MenuItem>
            ))}
          </MenuList>
        </Popover> */}
      </>
    )
  }

  const ScreenShareBTN = ({ isMobile, isTab }: any) => {
    const mMeeting = useMeeting()
    const localScreenShareOn = mMeeting?.localScreenShareOn
    const toggleScreenShare = mMeeting?.toggleScreenShare
    const presenterId = mMeeting?.presenterId

    // return isMobile || isTab ? (
    //   <MobileIconButton
    //     id='screen-share-btn'
    //     tooltipTitle={
    //       presenterId
    //         ? localScreenShareOn
    //           ? 'Stop Presenting'
    //           : null
    //         : 'Present Screen'
    //     }
    //     buttonText={
    //       presenterId
    //         ? localScreenShareOn
    //           ? 'Stop Presenting'
    //           : null
    //         : 'Present Screen'
    //     }
    //     isFocused={localScreenShareOn}
    //     Icon={ScreenShareIcon}
    //     onClick={() => {
    //       toggleScreenShare()
    //     }}
    //     disabled={
    //       presenterId
    //         ? localScreenShareOn
    //           ? false
    //           : true
    //         : isMobile
    //           ? true
    //           : false
    //     }
    //   />
    // ) : (
    //   <OutlinedButton
    //     Icon={ScreenShareIcon}
    //     onClick={() => {
    //       toggleScreenShare()
    //     }}
    //     isFocused={localScreenShareOn}
    //     tooltip={
    //       presenterId
    //         ? localScreenShareOn
    //           ? 'Stop Presenting'
    //           : null
    //         : 'Present Screen'
    //     }
    //     disabled={presenterId ? (localScreenShareOn ? false : true) : false}
    //   />
    // )
  }

  const LeaveBTN = () => {
    const mMeeting = useMeeting()

    return (
      <>
        <OutlinedButton
          Icon={<Phone className='size-5' />}
          bgColor='bg-red-150'
          onClick={() => {
            mMeeting.leave()
            setIsMeetingLeft(true)
          }}
          tooltip='Leave Meeting'
        />
      </>
    )
  }

  const ChatBTN = ({ isMobile, isTab }: any) => {
    return isMobile || isTab ? (
      <>
        mobile icon
        {/* <MobileIconButton
        tooltipTitle={'Chat'}
        buttonText={'Chat'}
        Icon={ChatIcon}
        isFocused={sideBarMode === sideBarModes.CHAT}
        onClick={() => {
            setSideBarMode((s) =>
                s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        )
    }}
    /> */}
      </>
    ) : (
      <>
        <OutlinedButton
          Icon={<MessageSquareText className='size-5' />}
          onClick={() => {
            setSideBarMode((s: any) =>
              s === sideBarModes.CHAT ? null : sideBarModes.CHAT
            )
          }}
          isFocused={sideBarMode === 'CHAT'}
          tooltip='View Chat'
        />
      </>
    )
  }

  const ParticipantsBTN = ({ isMobile, isTab }: any) => {
    const { participants } = useMeeting()
    return isMobile || isTab ? (
      <>
        mobile icon
        {/* <MobileIconButton
          tooltipTitle={'Participants'}
          isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
          buttonText={'Participants'}
          disabledOpacity={1}
          Icon={ParticipantsIcon}
          onClick={() => {
            setSideBarMode((s) =>
              s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
            )
          }}
          badge={`${new Map(participants)?.size}`}
        /> */}
      </>
    ) : (
      <>
        <OutlinedButton
          Icon={<Users className='size-5' />}
          onClick={() => {
            setSideBarMode((s: any) =>
              s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
            )
          }}
          isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
          tooltip={'View Participants'}
          badge={`${new Map(participants)?.size}`}
        />
      </>
    )
  }

  const MeetingIdCopyBTN = () => {
    const mMeeting = useMeeting()
    const [isCopied, setIsCopied] = useState(false)
    return (
      <div className='ml-4 mt-4 flex items-center  justify-center lg:ml-0 xl:mt-0'>
        <div className='border-gray-850 flex items-center justify-center rounded-md border-2 p-2'>
          <h1 className='text-base text-white '>{mMeeting.meetingId}</h1>
          <button
            className='ml-2'
            onClick={() => {
              navigator.clipboard.writeText(mMeeting.meetingId)
              setIsCopied(true)
              setTimeout(() => {
                setIsCopied(false)
              }, 3000)
            }}
          >
            {isCopied ? (
              <CheckIcon className='h-5 w-5 text-green-400' />
            ) : (
              <Clipboard className='h-5 w-5 text-white' />
            )}
          </button>
        </div>

        {/* <div className="flex border-2 border-gray-850 p-2 ml-4 rounded-md items-center justify-center">
          <h1 className="text-white">00:30</h1>
        </div> */}
      </div>
    )
  }

  const tollTipEl = useRef<any>()

  const [open, setOpen] = useState(false)

  const handleClickFAB = () => {
    setOpen(true)
  }

  const handleCloseFAB = () => {
    setOpen(false)
  }

  const BottomBarButtonTypes = useMemo(
    () => ({
      END_CALL: 'END_CALL',
      CHAT: 'CHAT',
      PARTICIPANTS: 'PARTICIPANTS',
      SCREEN_SHARE: 'SCREEN_SHARE',
      WEBCAM: 'WEBCAM',
      MIC: 'MIC',
      RAISE_HAND: 'RAISE_HAND',
      RECORDING: 'RECORDING',
      MEETING_ID_COPY: 'MEETING_ID_COPY'
    }),
    []
  )

  const otherFeatures = [
    { icon: BottomBarButtonTypes.RAISE_HAND },
    { icon: BottomBarButtonTypes.SCREEN_SHARE },
    { icon: BottomBarButtonTypes.CHAT },
    { icon: BottomBarButtonTypes.PARTICIPANTS },
    { icon: BottomBarButtonTypes.MEETING_ID_COPY }
  ]

  return false ? (
    <div
      className='flex items-center justify-center bg-white'
      // style={{ height: bottomBarHeight }}
    >
      <LeaveBTN />
      <MicBTN />
      <WebCamBTN />
      {/* <RecordingBTN /> */}
      {/* <OutlinedButton Icon={MoreHorizIcon} onClick={handleClickFAB} /> */}
      {/* <SwipeableDrawer
        anchor={'bottom'}
        open={Boolean(open)}
        onClose={handleCloseFAB}
        onOpen={handleClickFAB}
        style={{ paddingBottom: '100px' }}
      >
        <Grid container className='bg-gray-800 py-6'>
          {otherFeatures.map(({ icon }, index) => {
            return (
              <Grid
                key={`icon_${index}`}
                className='flex items-center justify-center'
                item
                xs={icon === BottomBarButtonTypes.MEETING_ID_COPY ? 7 : 4}
                sm={icon === BottomBarButtonTypes.MEETING_ID_COPY ? 5 : 3}
                md={icon === BottomBarButtonTypes.MEETING_ID_COPY ? 3 : 2}
              >
                {icon === BottomBarButtonTypes.RAISE_HAND ? (
                  <RaiseHandBTN isMobile={isMobile} isTab={isTab} />
                ) : icon === BottomBarButtonTypes.SCREEN_SHARE ? (
                  <ScreenShareBTN isMobile={isMobile} isTab={isTab} />
                ) : icon === BottomBarButtonTypes.CHAT ? (
                  <ChatBTN isMobile={isMobile} isTab={isTab} />
                ) : icon === BottomBarButtonTypes.PARTICIPANTS ? (
                  <ParticipantsBTN isMobile={isMobile} isTab={isTab} />
                ) : icon === BottomBarButtonTypes.MEETING_ID_COPY ? (
                  <MeetingIdCopyBTN isMobile={isMobile} isTab={isTab} />
                ) : null}
              </Grid>
            )
          })}
        </Grid>
      </SwipeableDrawer> */}
    </div>
  ) : (
    <div className='hidden h-16 bg-white px-2 pb-2 md:flex lg:px-2 xl:px-6'>
      {/* <MeetingIdCopyBTN /> */}

      <div className='flex flex-1 items-center justify-center' ref={tollTipEl}>
        {/* <RecordingBTN /> */}
        <RaiseHandBTN />
        <MicBTN />
        <WebCamBTN />
        {/* <ScreenShareBTN isMobile={isMobile} isTab={isTab} /> */}
        <LeaveBTN />
      </div>
      <div className='flex items-center justify-center'>
        <ChatBTN />
        <ParticipantsBTN />
      </div>
    </div>
  )
}
