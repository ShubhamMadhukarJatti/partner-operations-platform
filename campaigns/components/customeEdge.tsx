import React, { type FC } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps
} from '@xyflow/react'

const CustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className='rounded-lg px-2 py-1 '
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              color: data.label === 'Yes' ? '#1E3A8A' : '#FC362F',
              background: data.label === 'Yes' ? '#E5EFFE' : '#FC362F1A'
            }}
          >
            <p className='text-xs font-bold'>{data.label}</p>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default CustomEdge
