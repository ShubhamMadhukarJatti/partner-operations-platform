'use client'

import { FC } from 'react'
import TextField from '@mui/material/TextField'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'

interface Step3Props {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Step3: FC<Step3Props> = ({ name, onChange }) => {
  return (
    <>
      <SectionHeader
        title='Tell Us About Userself'
        subtitle='What is your Full Name?'
      />
      <div className='w-full max-w-[500px]'>
        <TextField
          label='Name'
          type='text'
          variant='outlined'
          placeholder='Colin John'
          fullWidth
          value={name}
          onChange={onChange}
        />
      </div>
    </>
  )
}
