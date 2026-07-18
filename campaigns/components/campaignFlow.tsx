import { ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'

import { ITemplateWorkFlow } from '../interfaces'
import CustomEdge from './customeEdge'
import customNode from './customNode'

export const CampaignFlow = ({
  templateWorkFlow,
  isEditable
}: {
  templateWorkFlow: ITemplateWorkFlow
  isEditable: boolean
}) => {
  const nodeTypes = {
    custom: customNode
  }

  const edgeTypes = {
    custom: CustomEdge
  }

  const [nodes, , onNodesChange] = useNodesState(templateWorkFlow.nodes)
  const [edges, , onEdgesChange] = useEdgesState(templateWorkFlow.edges)

  return (
    <div
      style={{ height: isEditable ? '92%' : 400 }}
      className='mt-6 w-full rounded bg-[#F8FBFF]'
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
      />
    </div>
  )
}
