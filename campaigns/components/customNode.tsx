import React, { memo, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { Clock, Icon, Pause } from 'iconsax-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { OutlinedTextarea } from '@/components/ui/outlined-textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export type ICustomNode = {
  title: string
  subtitle?: string
  icon?: Icon
  borderColor?: string
  allowAddingCondition?: boolean
}

const CustomNode = ({
  data,
  positionAbsoluteX,
  positionAbsoluteY,
  id: currentNodeId
}: NodeProps<Node<ICustomNode>>) => {
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow()
  const nodes = getNodes() // Get all nodes
  const edges = getEdges() // Get all edges
  const sourceId = edges.find((edge) => edge.target === currentNodeId)?.source
  const sourceNode = nodes.find((node) => node.id === sourceId)

  const handleAddCondition = (type: string) => {
    const sourceNodeId = sourceNode?.id

    if (!sourceNodeId) return // Ensure we have a current node

    const isDelay = type === 'delay'
    const newNodeId = (nodes.length + 1).toString()
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: {
        x: positionAbsoluteX,
        y: positionAbsoluteY
      },
      data: {
        title: isDelay ? `Wait For` : 'Active Time',
        icon: isDelay ? Pause : Clock,
        borderColor: isDelay ? '#E4E7EE' : '#83C413'
      }
    }

    setNodes((nds) => {
      const updatedNodes = nds.map((node) =>
        node.id !== currentNodeId
          ? node
          : {
              ...node,
              position: { x: node.position.x, y: node.position.y + 100 },
              data: {
                ...node.data,
                allowAddingCondition: false
              }
            }
      )
      return updatedNodes.concat(newNode)
    })
    // Update edges: newNode connects to current node, and source of current node is updated
    setEdges((eds) => {
      const updatedEdges = eds.map((edge) =>
        edge.target === currentNodeId
          ? { ...edge, source: sourceNodeId, target: newNodeId } // Update current node's source
          : edge
      )

      return updatedEdges.concat({
        id: `e-${newNodeId}`,
        type: 'custom',
        animated: true,
        source: newNodeId, // newNode as source
        target: currentNodeId // current node as target
      })
    })
  }

  return (
    <div>
      <NodeUI data={data} id={currentNodeId} />
      <div className=''></div>
      <Handle
        type='target'
        position={Position.Top}
        className='!border-transparent !bg-transparent'
        style={{
          padding: data.allowAddingCondition ? '0  1rem 3rem 0' : 0
        }}
      >
        {data.allowAddingCondition && (
          <div className=''>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex h-5 w-5 items-center justify-center rounded-full border border-[#0062F1] bg-[#F8FBFF] text-[#0062F1]'>
                  <p className='text-md'>+</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className=''>
                <div className='flex w-[200px] flex-col gap-2 rounded-sm bg-white p-2'>
                  <button
                    className='hover:scale-105'
                    onClick={() => {
                      handleAddCondition('delay')
                    }}
                  >
                    <NodeUI
                      data={{
                        title: 'Wait For',
                        icon: Pause
                      }}
                    />
                  </button>
                  <button
                    className='hover:scale-105'
                    onClick={() => {
                      handleAddCondition('activeFor')
                    }}
                  >
                    <NodeUI
                      data={{
                        title: 'Active Time',
                        icon: Clock
                      }}
                    />
                  </button>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </Handle>
      <Handle
        type='source'
        position={Position.Bottom}
        className='!border-transparent !bg-transparent'
      />
    </div>
  )
}

export default memo(CustomNode)

export const NodeUI = ({
  data,
  id,
  isEditable = false
}: {
  data: ICustomNode
  id?: string
  isEditable?: boolean
}) => {
  const [openEmailModal, setOpenEmailModal] = useState(false)
  return (
    <div>
      <div
        onClick={() => {
          if (data.title.includes('Email') && !isEditable) {
            setOpenEmailModal(true)
          }
        }}
        className={`rounded-md px-4 py-2 shadow-md ${data.borderColor ? 'border-l-2' : ''}`}
        style={{
          borderColor: data.borderColor ? data.borderColor : 'transparent'
        }}
      >
        <div className='flex w-full items-center'>
          {data.icon && (
            <div className='flex h-6 w-6 items-center justify-center'>
              <data.icon />
            </div>
          )}
          <div className='ml-2 w-full'>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-medium'>{data.title}</div>
              {isEditable && !data.title.includes('Email') && (
                <EditableNodeOption title={data.title} id={id} />
              )}
            </div>
            {data.subtitle && (
              <div className='text-xs font-normal'>{data.subtitle}</div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={openEmailModal} onOpenChange={setOpenEmailModal}>
        <DialogContent hideCloseBtn={true} className='max-w-6xl space-y-2'>
          <div className='flex justify-between gap-2'>
            <div className='w-[30%] rounded-md border border-[#E4E7EE] p-4'>
              <div>
                <h2 className='text-md font-bold'>Campaign Name</h2>
                <p className='text-md font-normal text-[#2A3241]'>
                  {data.title}
                </p>
              </div>
              <div>
                <h2 className='text-md mt-4 font-bold'>Triggers</h2>
                <p className='text-md font-normal text-[#2A3241]'>
                  When first lead is added on referral program
                </p>
              </div>
            </div>
            <div className='flex-1 rounded-md border border-[#E4E7EE] p-4'>
              <div className='flex w-full items-center justify-between'>
                <h2 className='text-xl font-bold'>Create Email Campaign</h2>
                <button
                  className='flex h-2 w-2 items-center justify-center rounded-full border-2 border-[black] p-3'
                  onClick={() => setOpenEmailModal(false)}
                >
                  <p className='text-md text-black'>x</p>
                </button>
              </div>
              <OutlinedInput
                label='Email Name'
                className='mt-8'
                type='text'
                tabIndex={1}
              />
              <OutlinedInput
                label='First Name'
                className='mt-8'
                type='text'
                tabIndex={1}
              />
              <OutlinedInput
                label='From'
                className='mt-8'
                type='text'
                tabIndex={1}
              />
              <OutlinedInput
                label='Subject'
                className='mt-8'
                type='text'
                tabIndex={1}
              />
              <OutlinedTextarea
                label='Message'
                className='mt-8 min-h-48'
                tabIndex={1}
              />
            </div>
          </div>
          <div className='ml-auto'>
            <Button className='w-36 rounded'>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const EditableNodeOption = ({ title, id }: { title: string; id?: string }) => {
  const [gap, setGap] = useState('1')
  const { setNodes } = useReactFlow()
  return (
    <div className='flex items-center gap-2 text-xs font-normal'>
      <p>=</p>
      <Select
        name={title}
        value={gap}
        defaultValue='1'
        onValueChange={(value) => {
          setNodes((nds) => {
            const updatedNodes = nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      title: title.includes('Active Time')
                        ? `Active Time ${value} Months`
                        : `Wait For ${value} Days`
                    }
                  }
                : node
            )
            return updatedNodes
          })
          setGap(value)
        }}
      >
        <SelectTrigger
          style={{
            background: title === 'Active time' ? '#83C4131A' : '#E4E7EE',
            color: title === 'Active time' ? '#83C413' : '#3B475D'
          }}
          className='h-auto w-full rounded-lg p-1 text-xs'
        >
          <SelectValue placeholder='1' />
        </SelectTrigger>

        <SelectContent>
          {Array.from({
            length: title === 'Active time' ? 12 : 30
          }).map((_, index) => (
            <SelectItem key={index} value={String(index + 1)}>
              {String(index + 1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p>{title === 'Active time' ? 'Months' : 'Days'}</p>
    </div>
  )
}
