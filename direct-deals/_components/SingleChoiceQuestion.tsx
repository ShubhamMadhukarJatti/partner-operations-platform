'use client'

import React, { useState } from 'react'
import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type optionType = {
  id: number
  value: string
}

const SingleChoiceQuestion = () => {
  const [optionCount, setOptionCount] = useState<number>(1)
  const [options, setOptions] = useState<optionType[]>([
    {
      id: 1,
      value: ''
    }
  ])

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions((prev) => [
        ...prev,
        { id: prev.length ? prev[prev.length - 1].id + 1 : 1, value: '' }
      ])
    }
  }

  const handleOptionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    option: optionType
  ) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === option.id ? { ...opt, value: e.target.value } : opt
      )
    )
  }

  const deleteOption = (id: number) => {
    if (options.length > 1) {
      setOptions((prev) => prev.filter((option) => option.id !== id))
    }
  }
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
        <Input placeholder='Enter the question' />
        <Trash2Icon />
      </div>
      <div className='flex flex-col gap-3'>
        {options.map((option, key) => {
          return (
            <RadioGroup key={key}>
              <div className='flex w-[96%] items-center space-x-2'>
                <RadioGroupItem
                  disabled
                  value={option.value}
                  id={String(option.id)}
                />
                <Input
                  onChange={(e) => handleOptionInputChange(e, option)}
                  value={option.value}
                  placeholder='Enter value'
                />
                <Trash2Icon onClick={() => deleteOption(option.id)} />
              </div>
            </RadioGroup>
          )
        })}
      </div>
      {options.length < 4 && (
        <Button
          onClick={() => handleAddOption()}
          type='button'
          className='h-auto w-auto justify-start p-0 font-bold text-[#3E50F7]'
          variant={'link'}
        >
          Add new option
        </Button>
      )}
    </div>
  )
}

export default SingleChoiceQuestion
