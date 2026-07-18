'use client'

import { FC } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { WorldCode } from '@/components/icons/icons'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'

interface Step4Props {
  url: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Step4: FC<Step4Props> = ({ url, onChange }) => {
  return (
    <>
      <SectionHeader
        title='Teams &amp; Operations'
        subtitle='Enter your company website'
      />
      <div className='w-full max-w-[500px]'>
        <TextField
          label='website'
          variant='outlined'
          placeholder='www.companyname.com'
          fullWidth
          value={url}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <WorldCode />
              </InputAdornment>
            )
          }}
        />
      </div>
    </>
  )
}
