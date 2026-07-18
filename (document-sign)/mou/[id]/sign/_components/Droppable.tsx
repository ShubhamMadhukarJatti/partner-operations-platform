import React from 'react'
import { useDroppable } from '@dnd-kit/core'

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable'
  })
  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div ref={setNodeRef} className='flex w-full flex-1' style={style}>
      {props.children}
    </div>
  )
}
