'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { collection, getDocs } from 'firebase/firestore'
import DatePicker from 'react-datepicker'

import { EmailStatsArgs } from '@/lib/db/email'
import { dbFirebase } from '@/lib/firebase/config/client-config'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import AdminHeader from '../_components/admin-header'
import SendOneTriggerForm from '../_components/SendOneTriggerForm'

const DEFAULT_STATS_PARAMS = {
  eventType: 'Open',
  env: 'DEV',
  page: 0,
  size: 20,
  sentAt: format(new Date(), 'yyyy-MM-dd')
} as EmailStatsArgs

const RunTrigger = () => {
  const [triggerType, setTriggerType] = useState('')
  const [templateId, setTemplateId] = useState('')

  const [emailTemplates, setEmailTemplates] = useState<any>([])
  const [excludedEmail, setExcludedEmail] = useState<string>('')
  const [excludedEmailArray, setExcludedEmailArray] = useState<string[]>([])
  const [statsParams, setStatsParams] =
    useState<EmailStatsArgs>(DEFAULT_STATS_PARAMS)

  const [date, setDate] = useState(new Date())

  const handleRunTrigger = () => {
    const payload = {
      triggerType,
      templateCode: templateId,
      exclusions: excludedEmailArray,
      updatedBefore: date
    }

    try {
      const response = fetch('/api/run-trigger', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      showCustomToast('Success', 'Trigger is saved', 'success', 5000)
      setTriggerType('')
      setTemplateId('')
      setExcludedEmail('')
      setExcludedEmailArray([])
    } catch (error) {
      console.log(error)
      showCustomToast('Error', 'Error occured', 'error', 5000)
    }
  }

  console.log(excludedEmailArray)

  useEffect(() => {
    if (excludedEmail.trim().length && excludedEmail != '') {
      setExcludedEmailArray(excludedEmail.split(','))
    }
  }, [excludedEmail])

  useEffect(() => {
    const fetchEmailTemplate = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(dbFirebase, 'EmailTemplates')
        )

        const emailTemplates = querySnapshot.docs.map((doc) => ({
          id: doc.id, // To get the document ID if needed
          ...doc.data() // To get the actual document data
        }))

        setEmailTemplates(emailTemplates)
      } catch (error) {
        console.error('Error fetching email templates: ', error)
        return []
      }
    }
    fetchEmailTemplate()
  }, [])
  return (
    <div className='min-h-screen bg-gray-100 pb-6'>
      <AdminHeader />
      <div className='mx-auto mt-10 max-w-3xl rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-6 text-2xl font-bold'>Run Trigger</h2>
        <div className='mb-4 flex flex-col'>
          <Label htmlFor='' className='mb-2 text-left font-semibold'>
            Trigger Type:
          </Label>
          <Select
            name='eventType'
            value={triggerType}
            onValueChange={(value) => setTriggerType(value)}
          >
            <SelectTrigger className='w-full rounded-lg'>
              <SelectValue placeholder='Select Trigger Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='NOT_MIGRATED'>NOT_MIGRATED</SelectItem>
              <SelectItem value='USER_ONE_TIME'>USER_ONE_TIME</SelectItem>
              <SelectItem value='NOT_KYB'>NOT_KYB</SelectItem>
              <SelectItem value='PROFILE_NOT_COMPLETED'>
                PROFILE_NOT_COMPLETED
              </SelectItem>
              <SelectItem value='ORG_ONE_TIME'>ORG_ONE_TIME</SelectItem>
              <SelectItem value='EMAIL_SUBSCRIBED'>EMAIL_SUBSCRIBED</SelectItem>
              <SelectItem value='UNVERIFIED_EMAIL_ORG'>
                UNVERIFIED_EMAIL_ORG
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {emailTemplates.length > 0 && (
          <div className='mb-4 flex flex-col'>
            <Label
              htmlFor='select-expectations'
              className='mb-2 text-left font-semibold'
            >
              Email Template
            </Label>
            <Select
              name='emailTemplate'
              value={templateId}
              onValueChange={(value) => setTemplateId(value)}
            >
              <SelectTrigger className='w-full rounded-lg'>
                <SelectValue placeholder='Select Template' />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((item: any) => {
                  return (
                    <SelectItem value={item.id} key={item.id}>
                      {item.id}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='mb-4 flex flex-col'>
          <Label className='mb-2 font-semibold'>
            Select time of shooting bulk emails
          </Label>
          <span className='rounded-lg border-2 border-solid px-4 py-1'>
            <DatePicker
              className='w-full '
              dateFormat='YYYY-MM-dd'
              selected={date}
              onChange={(date: any) => {
                setDate(date)
              }}
            />
          </span>
        </div>
        <Label className='mb-2 font-semibold'>
          Enter Email you want to exclude (Comma separated)
        </Label>
        <Input
          type='email'
          value={excludedEmail}
          onChange={(e) => setExcludedEmail(e.target.value)}
          className='mb-4 mt-1 w-full'
          placeholder='example1@gmail.com, example2@gmail.com...'
        />

        {excludedEmailArray.length > 0 && (
          <div className='flex gap-3'>
            {excludedEmailArray.map((email, key) => (
              <span
                className='rounded-xl bg-gray-200 px-2 py-1 text-xs'
                key={key}
              >
                {email}
              </span>
            ))}
          </div>
        )}
        <button
          className='mt-6 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          onClick={() => handleRunTrigger()}
        >
          Run Now
        </button>
      </div>

      <SendOneTriggerForm emailTemplates={emailTemplates} />
    </div>
  )
}

export default RunTrigger
