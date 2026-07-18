import React, { useMemo } from 'react'
import { useReactFlow } from '@xyflow/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'

import { PartnerI } from '../interfaces'
import { ICustomNode, NodeUI } from './customNode'

export const TemplateSettings: React.FC<{
  allPartners: PartnerI[]
  selectedPartner: string
  setSelectedPartner: React.Dispatch<React.SetStateAction<string>>
}> = ({ allPartners, selectedPartner, setSelectedPartner }) => {
  const { getNodes, getEdges } = useReactFlow()
  const nodes = getNodes()
  const edges = getEdges()

  const conditions = useMemo(() => {
    const conditionEdges = edges.filter(
      (edge) =>
        typeof edge?.data?.label === 'string' && edge.data.label.length > 0
    )
    const conditions = conditionEdges.map((edge) => {
      const condition = {
        conditionLabel: edge?.data?.label as string,
        nodeIdsUnderCondition: [edge.target]
      }
      return condition
    })
    return conditions
  }, [nodes, edges])
  return (
    <div className=' mt-6 h-[92%] w-full rounded-lg border border-[#E4E7EE] p-4 md:w-[28%]'>
      <h2 className='text-md font-bold text-[#2A3241]'>Template Settings</h2>
      <PartnerOptions
        allPartners={allPartners}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
      />
      {conditions?.map((condition, index) => {
        return (
          <div key={index}>
            <h2 className='text-md font-bold text-[#2A3241]'>
              Segment Filters
            </h2>

            <div
              className='my-4 flex w-14 justify-center rounded-lg px-2 py-1'
              style={{
                background:
                  condition.conditionLabel === 'Yes' ? '#E5EFFE' : '#FC362F1A'
              }}
            >
              <p
                className='text-shark-base font-bold'
                style={{
                  color:
                    condition.conditionLabel === 'Yes' ? '#1E3A8A' : '#FC362F'
                }}
              >
                {condition.conditionLabel}
              </p>
            </div>
            {condition.nodeIdsUnderCondition.map((nodeId, index) => {
              const node = nodes.find((node) => node.id === nodeId)
              if (!node) return null
              return (
                <div className='my-4' key={index}>
                  <NodeUI
                    id={node.id}
                    data={node.data as ICustomNode}
                    isEditable={['Active Time', 'Wait For'].some((title) =>
                      (node.data.title as string).includes(title)
                    )}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const PartnerOptions: React.FC<{
  allPartners: PartnerI[]
  selectedPartner: string
  setSelectedPartner: React.Dispatch<React.SetStateAction<string>>
}> = ({ allPartners, selectedPartner, setSelectedPartner }) => {
  // const [assignedPartner, setAssignedPartner] = useState('Select')

  return (
    <div className='mb-10 mt-6'>
      <Select
        name='partnershipType'
        value={selectedPartner}
        defaultValue={''}
        onValueChange={(value) => setSelectedPartner(value)}
      >
        <SelectTrigger
          className='mt-2 w-full rounded-lg'
          label='Assign to Partner'
        >
          <SelectValue placeholder='Select' />
        </SelectTrigger>

        <SelectContent>
          {allPartners.map((cur, i) => (
            <SelectItem key={i} value={String(cur.orgId)}>
              {cur.orgName}
            </SelectItem>
          ))}
          <SelectItem value={'all'}>All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
