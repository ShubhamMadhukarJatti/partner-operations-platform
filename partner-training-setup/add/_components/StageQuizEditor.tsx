'use client'

import React, { useState } from 'react'
import { Check, Circle, GripVertical, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showCustomToast } from '@/components/custom-toast'

export interface QuizChoice {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizStageData {
  question: string
  choices: QuizChoice[]
}

interface StageQuizEditorProps {
  initialData?: QuizStageData
  onSave: (data: QuizStageData) => void | Promise<void>
  isSaving?: boolean
  contentCreated?: boolean
}

const StageQuizEditor = ({
  initialData,
  onSave,
  isSaving = false,
  contentCreated = false
}: StageQuizEditorProps) => {
  const [data, setData] = useState<QuizStageData>({
    question: initialData?.question || '',
    choices: initialData?.choices || [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false }
    ]
  })

  const updateChoice = (id: string, updates: Partial<QuizChoice>) => {
    setData({
      ...data,
      choices: data.choices.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })
  }

  const setCorrectChoice = (id: string) => {
    setData({
      ...data,
      choices: data.choices.map((c) => ({ ...c, isCorrect: c.id === id }))
    })
  }

  const removeChoice = (id: string) => {
    setData({
      ...data,
      choices: data.choices.filter((c) => c.id !== id)
    })
  }

  const addChoice = () => {
    // Generate a unique ID for the new choice
    const maxId = Math.max(...data.choices.map((c) => parseInt(c.id) || 0), 0)
    const newId = (maxId + 1).toString()

    setData({
      ...data,
      choices: [...data.choices, { id: newId, text: '', isCorrect: false }]
    })
  }

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    // Question is required
    if (!data.question.trim()) {
      return false
    }

    // At least two choices with text are required
    const validChoices = data.choices.filter((c) => c.text.trim())
    if (validChoices.length < 2) {
      return false
    }

    // At least one choice must be marked as correct
    const hasCorrectChoice = validChoices.some((c) => c.isCorrect)
    if (!hasCorrectChoice) {
      return false
    }

    // All validations passed
    return true
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header Buttons */}
      {!contentCreated && (
        <div className='mb-4 flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={() =>
              setData({
                question: '',
                choices: [
                  { id: '1', text: '', isCorrect: false },
                  { id: '2', text: '', isCorrect: false },
                  { id: '3', text: '', isCorrect: false },
                  { id: '4', text: '', isCorrect: false }
                ]
              })
            }
          >
            Clear
          </Button>
          <Button
            className='bg-[#3E50F7] text-white hover:bg-blue-700'
            onClick={async () => {
              if (!isFormValid()) {
                showCustomToast(
                  'Error',
                  'Please fill in all required fields correctly',
                  'error',
                  5000
                )
                return
              }
              await onSave(data)
            }}
            disabled={isSaving || !isFormValid()}
          >
            {isSaving ? 'Saving...' : 'Save Module'}
          </Button>
        </div>
      )}

      {/* Question */}
      <div className='space-y-2'>
        <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
          What should partner know? <span className='text-red-500'>*</span>
        </Label>
        <Input
          value={data.question}
          onChange={(e) => setData({ ...data, question: e.target.value })}
          placeholder=''
          className='bg-gray-50 dark:bg-white/5'
          disabled={contentCreated}
        />
      </div>

      {/* Choices */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label className='flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white'>
            Choices <span className='text-red-500'>*</span>
          </Label>
          {data.choices.length < 4 && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addChoice}
              className='gap-2'
              disabled={contentCreated}
            >
              <Plus size={16} />
              Add Choice
            </Button>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          {data.choices.map((choice) => (
            <div key={choice.id} className='flex items-center gap-3'>
              <GripVertical className='text-gray-300' size={20} />
              <button
                onClick={() => setCorrectChoice(choice.id)}
                className='text-gray-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
                type='button'
                disabled={contentCreated}
              >
                {choice.isCorrect ? (
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#3E50F7] text-white'>
                    <Check size={14} />
                  </div>
                ) : (
                  <Circle size={24} />
                )}
              </button>
              <Input
                value={choice.text}
                onChange={(e) =>
                  updateChoice(choice.id, { text: e.target.value })
                }
                placeholder='Add a possible answer'
                className='bg-gray-50 dark:bg-white/5'
                disabled={contentCreated}
              />
              <button
                onClick={() => removeChoice(choice.id)}
                className='text-gray-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white'
                type='button'
                disabled={data.choices.length <= 2 || contentCreated}
                title={
                  contentCreated
                    ? 'Content already created'
                    : data.choices.length <= 2
                      ? 'At least 2 choices are required'
                      : 'Remove choice'
                }
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        {data.choices.length >= 10 && (
          <p className='text-xs text-gray-500 dark:text-white'>
            Maximum 10 choices allowed
          </p>
        )}
      </div>
    </div>
  )
}

export default StageQuizEditor
