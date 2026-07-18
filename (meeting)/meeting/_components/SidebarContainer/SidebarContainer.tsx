import React from 'react'
import { useMeeting } from '@videosdk.live/react-sdk'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ChatSidePanel } from './ChatSidePanel'

// import { ParticipantSidePanel } from './ParticipantSidePanel'

const SideBarTabView = ({
  height,
  sideBarContainerWidth,
  panelHeight,
  sideBarMode,
  raisedHandsParticipants,
  panelHeaderHeight,
  panelHeaderPadding,
  panelPadding,
  handleClose
}: any) => {
  const { participants } = useMeeting()

  return (
    <div className='   h-full min-w-[26.5rem] border-b border-l  border-border bg-white'>
      <>
        {sideBarMode && (
          <div className='flex items-center justify-between border border-border px-5 py-2'>
            <h4 className='text-base font-medium'>Message</h4>
            <Button
              onClick={handleClose}
              variant={'ghost'}
              className='hover:bg-transparent'
            >
              <X className='size-6' />
            </Button>
          </div>
        )}
        {sideBarMode === 'CHAT' ? (
          <div>
            <ChatSidePanel panelHeight={panelHeight} />
          </div>
        ) : null}
      </>
    </div>
  )
}

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction='up' ref={ref} {...props} />
// })
export function SidebarConatiner({
  height,
  sideBarMode,
  setSideBarMode,
  raisedHandsParticipants
}: any) {
  const handleClose = () => {
    setSideBarMode(null)
  }

  return sideBarMode ? (
    false ? (
      <>
        {/* <Dialog
        closeAfterTransition
        fullScreen
        open={sideBarMode}
        onClose={handleClose}
        TransitionComponent={Transition}
        >
        <SideBarTabView
          height={'100%'}
          sideBarContainerWidth={'100%'}
          panelHeight={height}
          sideBarMode={sideBarMode}
          raisedHandsParticipants={raisedHandsParticipants}
          panelHeaderHeight={panelHeaderHeight}
          panelHeaderPadding={panelHeaderPadding}
          panelPadding={panelPadding}
          handleClose={handleClose}
          />
      </Dialog> */}
      </>
    ) : (
      <SideBarTabView
        // height={paddedHeight}
        // sideBarContainerWidth={400}
        panelHeight={height}
        sideBarMode={sideBarMode}
        raisedHandsParticipants={raisedHandsParticipants}
        // panelHeaderHeight={2}
        // panelHeaderPadding={1}
        // panelPadding={panelPadding}
        handleClose={handleClose}
      />
    )
  ) : (
    <></>
  )
}
