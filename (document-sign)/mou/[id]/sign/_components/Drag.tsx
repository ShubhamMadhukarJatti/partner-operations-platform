import React, { useState } from 'react'
import { DndContext } from '@dnd-kit/core'

import { showCustomToast } from '@/components/custom-toast'

import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

export default function DragHere() {
  const [isDropped, setIsDropped] = useState(false)
  const draggableMarkup = <Draggable>Drag me</Draggable>

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* {!isDropped ? draggableMarkup : null} */}
      <Droppable>{isDropped ? draggableMarkup : 'Drop here'}</Droppable>
    </DndContext>
  )

  function handleDragEnd(event: any) {
    if (event.over && event.over.id === 'droppable') {
      showCustomToast('Success', 'Item dropped successfully', 'success', 5000)
    }
  }
}
