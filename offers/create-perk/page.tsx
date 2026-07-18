'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import { createPerk } from '@/lib/db/perk'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'

export default function CreatePerk() {
  const router = useRouter()

  const [perkData, setPerkData] = useState({
    creationTimestamp: '2024-08-21T06:31:54.569Z',
    lastUpdatedTimestamp: '2024-08-21T06:31:54.569Z',
    perkValue: 'string',
    perkDuration: '',
    clickedCount: 1,
    perkStatus: 'ACTIVE',
    perkIcon: 'string',
    perkName: '',
    redeemedCount: 0,
    perkDetails: '',
    perkUrl: '',
    steps: ['']
  })

  async function createNewPerk(perkInfo: any) {
    try {
      const response = await createPerk(perkInfo)

      if (!response) return
      setPerkData({
        ...perkData,
        perkName: '',
        redeemedCount: 0,
        perkDetails: '',
        perkUrl: '',
        steps: [''],
        perkDuration: ''
      })
      showCustomToast('Success', 'Perk created successfully!', 'success', 5000)
      router.push('/offers')
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleAddFields = () => {
    setPerkData({ ...perkData, steps: [...perkData.steps, ''] })
  }

  const handleRemoveFields = (index: number) => {
    const newSteps = [...perkData.steps]
    newSteps.splice(index, 1)
    setPerkData({ ...perkData, steps: newSteps })
  }

  const handleValueChange = (index: number, event: any) => {
    const values = [...perkData.steps]
    values[index] = event.target.value
    setPerkData({ ...perkData, steps: values })
  }

  return (
    <div className='border-t border-t-gray-300'>
      <div className='mb-1 mt-3 flex flex-row items-center gap-2'>
        <div
          className='cursor-pointer text-sm text-[#475569]'
          onClick={() => router.push('/offers')}
        >
          Offers
        </div>
        <p className='text-sm text-[#475569]'>{'>'}</p>
        <div className='text-sm text-[#475569]'>Create Perk</div>
      </div>
      <div className='text-2xl font-semibold'>Create a new perk</div>
      <div className='mx-4 mt-6 flex flex-col gap-10 rounded-lg border border-gray-300 p-10'>
        <div className='flex flex-row items-start justify-between gap-6'>
          <div className='basis-5/12'>
            <p className='font-medium'>Offer</p>
            <p className='font-light'>Set up the main details of your offer</p>
          </div>
          <div className='flex basis-7/12 flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name'>Offer Name</Label>
              <Input
                type='text'
                placeholder='Name'
                value={perkData?.perkName}
                onChange={(e) =>
                  setPerkData({ ...perkData, perkName: e.target.value })
                }
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='redemptionLink'>Redemption Link</Label>
              <Input
                type='text'
                placeholder='https://'
                value={perkData?.perkUrl}
                onChange={(e) =>
                  setPerkData({ ...perkData, perkUrl: e.target.value })
                }
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='redemptionCode'>Redemption code (if any)</Label>
              <Input type='text' placeholder='Enter Code here' />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='redemptionNumber'>
                Enter maximum number of redemptions
              </Label>
              <Input
                type='number'
                placeholder='Enter here'
                value={perkData?.redeemedCount}
                onChange={(e) =>
                  setPerkData({
                    ...perkData,
                    redeemedCount: e.target.valueAsNumber
                  })
                }
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='validUpto'>Valid Upto</Label>
              <Input
                type='text'
                placeholder='Enter here'
                value={perkData?.perkDuration}
                onChange={(e) =>
                  setPerkData({ ...perkData, perkDuration: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm'>Description of the offer</p>
          <Textarea
            className='h-24 resize-none'
            placeholder='Briefly describe your offer'
            id='message'
            value={perkData?.perkDetails}
            onChange={(e) =>
              setPerkData({ ...perkData, perkDetails: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm'>Steps to redeem</p>
          {perkData?.steps.map((step, index) => (
            <div
              className='flex flex-row items-center justify-between gap-5'
              key={index}
            >
              <Input
                type='text'
                placeholder='Enter here'
                value={step}
                onChange={(e) => handleValueChange(index, e)}
              />

              <button
                className='rounded-md bg-red-500 px-4 py-2'
                onClick={() => handleRemoveFields(index)}
              >
                <Trash2 size={20} color={'#ffffff'} />
              </button>
            </div>
          ))}
          <button
            className='ml-auto mt-2 flex h-full w-fit flex-row items-center gap-3 rounded-md border border-white bg-blue-600 px-4 py-2 text-white hover:border hover:border-blue-600 hover:bg-white hover:text-blue-600'
            onClick={handleAddFields}
          >
            <Plus /> Add Field
          </button>
          {/*<Textarea*/}
          {/*  className='h-24 resize-none'*/}
          {/*  placeholder='Input redemption steps for easy redemption for your clients'*/}
          {/*  id='message'*/}
          {/*  value={perkData?.steps}*/}
          {/*  onChange={(e) =>*/}
          {/*    setPerkData({ ...perkData, steps: e.target.value })*/}
          {/*  }*/}
          {/*/>*/}
        </div>
        <button
          className='ml-auto rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white'
          onClick={() => createNewPerk(perkData)}
        >
          Create perk
        </button>
      </div>
    </div>
  )
}
