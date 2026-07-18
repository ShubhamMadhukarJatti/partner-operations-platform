'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { IconPlus } from '@tabler/icons-react'

import { isDummyFlow } from '@/lib/dummy-flow'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import CreateTaskModal from './CreateTaskModal'

interface CreateTaskSectionProps {
  isDisabled: boolean
}

const CreateTaskSection: React.FC<CreateTaskSectionProps> = ({
  isDisabled
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const params = useParams()
  const inDummyFlow = isDummyFlow(
    Array.isArray(params?.id) ? params.id[0] : params?.id
  )

  return (
    <>
      <div className='flex flex-col items-center gap-4 py-8 text-center'>
        <h3 className='text-base font-semibold text-text-100'>
          Create your first task
        </h3>
        <p className='text-sm text-text-60'>
          You can co manage the tasks with the partnerships.
        </p>
        <Button
          variant='primary'
          size='sm'
          disabled={isDisabled || inDummyFlow}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'flex w-32 items-center gap-2',
            (isDisabled || inDummyFlow) && 'cursor-not-allowed'
          )}
        >
          <IconPlus size={16} />
          Create task
        </Button>
      </div>

      <CreateTaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

export default CreateTaskSection
