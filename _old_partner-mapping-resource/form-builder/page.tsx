import React from 'react'

import { Input } from '@/components/ui/input'

export default function FormBuilder() {
  return (
    <div className='flex min-h-screen bg-[#f8fbff] font-sans'>
      {/* Sidebar: Form Builder */}
      <aside className='flex w-full max-w-md flex-col gap-6 border-r border-[#f3f6fd] bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-[#222]'>Form Builder</h2>
          <button className='rounded-lg bg-[#3e50f7] px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-[#2d3bb3]'>
            + Add Question
          </button>
        </div>
        {/* Branding */}
        <div className='mb-4 rounded-xl border border-[#f3f6fd] bg-[#fafbfc] p-4'>
          <div className='mb-4 flex items-center gap-3'>
            {/* Logo Box */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <div className='flex min-w-[140px] items-center gap-2 rounded-xl border border-[#eaf1ff] bg-white px-4 py-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C3EF7]'>
                    {/* Replace with actual logo if available */}
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='#fff'
                        strokeWidth='2'
                      />
                      <circle
                        cx='12'
                        cy='12'
                        r='6'
                        stroke='#fff'
                        strokeWidth='2'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-[#222]'>
                      digilogo.png
                    </span>
                    <span className='text-[10px] text-[#8b98b8]'>1.2Mb</span>
                  </div>
                </div>
                {/* Upload Banner Box */}
                <div className='ml-2 flex min-w-[160px] items-center gap-2 rounded-xl border-2 border-dashed border-[#eaf1ff] bg-white px-6 py-2'>
                  <svg
                    width='24'
                    height='24'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='text-[#8b98b8]'
                  >
                    <path
                      d='M12 16V8M12 8L8 12M12 8l4 4'
                      stroke='#8b98b8'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <rect
                      x='3'
                      y='3'
                      width='18'
                      height='18'
                      rx='4'
                      stroke='#eaf1ff'
                      strokeWidth='1.5'
                    />
                  </svg>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-[#8b98b8]'>
                      Upload Banner
                    </span>
                    <span className='text-[10px] text-[#8b98b8]'>
                      (100×100)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-2'>
            <label className='mb-1 block text-xs text-[#8b98b8]'>
              Form Title
            </label>
            <Input
              className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
              value='the Partner - Partner Program'
              readOnly
            />
          </div>
          <div>
            <label className='mb-1 block text-xs text-[#8b98b8]'>
              Description
            </label>
            <textarea
              className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
              rows={2}
              value='We own esports teams, produce esports events (online & offline) and manage influencers from gaming category.'
              readOnly
            />
          </div>
        </div>
        {/* Questions List */}
        <div className='mb-4'>
          <div className='mb-2 flex cursor-pointer items-center gap-2 rounded-lg border border-[#f3f6fd] bg-white px-4 py-3'>
            <span className='font-semibold text-[#3e50f7]'>•</span>
            <span className='text-sm text-[#222]'>
              What is your minimum ticket size?
            </span>
          </div>
          <div className='mb-2 flex cursor-pointer items-center gap-2 rounded-lg border border-[#f3f6fd] bg-white px-4 py-3'>
            <span className='font-semibold text-[#3e50f7]'>•</span>
            <span className='text-sm text-[#222]'>Phone Number</span>
          </div>
        </div>
        {/* Question Editor */}
        <div className='relative mt-2 rounded-xl border border-[#eaf1ff] bg-white p-4 shadow-md'>
          {/* Header */}
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold text-[#3e50f7]'>
                Multi Select
              </span>
              <svg
                className='h-4 w-4 text-[#8b98b8]'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  d='M6 8l4 4 4-4'
                  stroke='#8b98b8'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='flex items-center gap-3'>
              <span className='flex items-center gap-1 text-xs text-[#8b98b8]'>
                Required{' '}
                <Input
                  type='checkbox'
                  checked
                  className='ml-1 accent-[#3e50f7]'
                  readOnly
                />
              </span>
              <button className='flex h-6 w-6 items-center justify-center text-[#8b98b8] hover:text-[#3e50f7]'>
                {' '}
                <svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
                  <path
                    d='M8 2v12M2 8h12'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                </svg>{' '}
              </button>
              <button className='flex h-6 w-6 items-center justify-center text-[#8b98b8] hover:text-[#3e50f7]'>
                {' '}
                <svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
                  <rect
                    x='3'
                    y='7.25'
                    width='10'
                    height='1.5'
                    rx='0.75'
                    fill='currentColor'
                  />
                </svg>{' '}
              </button>
              <button className='flex h-6 w-6 items-center justify-center text-[#8b98b8] hover:text-[#3e50f7]'>
                {' '}
                <svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
                  <circle cx='8' cy='8' r='1.5' fill='currentColor' />
                  <circle cx='8' cy='3' r='1.5' fill='currentColor' />
                  <circle cx='8' cy='13' r='1.5' fill='currentColor' />
                </svg>{' '}
              </button>
            </div>
          </div>
          {/* Question Input */}
          <div className='mb-2'>
            <label className='mb-1 block text-xs text-[#8b98b8]'>
              Question
            </label>
            <Input
              className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e50f7]'
              value='Which below best describes you'
              readOnly
            />
          </div>
          {/* Options */}
          <div className='mb-2 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Input type='checkbox' className='accent-[#3e50f7]' disabled />
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                value='Option 1'
                readOnly
              />
            </div>
            <div className='flex items-center gap-2'>
              <Input type='checkbox' className='accent-[#3e50f7]' disabled />
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                value='Option 1'
                readOnly
              />
            </div>
            <div className='flex items-center gap-2'>
              <Input type='checkbox' className='accent-[#3e50f7]' disabled />
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                placeholder='Enter option'
              />
              <button className='flex h-6 w-6 items-center justify-center text-[#8b98b8] hover:text-[#3e50f7]'>
                {' '}
                <svg width='16' height='16' fill='none' viewBox='0 0 16 16'>
                  <rect
                    x='3'
                    y='7.25'
                    width='10'
                    height='1.5'
                    rx='0.75'
                    fill='currentColor'
                  />
                </svg>{' '}
              </button>
            </div>
            <button className='mt-1 text-left text-xs text-[#3e50f7]'>
              Add Option
            </button>
          </div>
          <button className='absolute bottom-4 right-4 rounded-lg bg-[#3e50f7] px-6 py-2 text-sm font-medium text-white shadow transition hover:bg-[#2d3bb3]'>
            Done
          </button>
        </div>
      </aside>
      {/* Main: Preview */}
      <main className='flex flex-1 flex-col gap-6 p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <span></span>
          <div className='flex items-center gap-3'>
            <span className='flex items-center gap-1 text-xs font-medium text-[#22C55E]'>
              <span className='inline-block h-2 w-2 rounded-full bg-[#22C55E]'></span>
              Active
            </span>
            <button className='rounded-lg bg-[#3e50f7] px-6 py-2 text-sm font-medium text-white shadow transition hover:bg-[#2d3bb3]'>
              Publish
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-6 rounded-2xl bg-white p-8 shadow'>
          {/* Preview Header */}
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-[#eaf1ff]'>
              <span className='text-2xl font-bold text-[#3e50f7]'>O</span>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-[#222]'>
                the Partner - Partner Program
              </h3>
              <p className='text-xs text-[#8b98b8]'>
                We own esports teams, produce esports events (online & offline)
                and manage influencers from gaming category.
              </p>
            </div>
          </div>
          {/* Preview Fields */}
          <div className='flex flex-col gap-4'>
            <div className='rounded-xl border border-[#f3f6fd] bg-white p-4'>
              <label className='mb-1 block text-xs text-[#8b98b8]'>Name</label>
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                placeholder='Enter Full name'
              />
              <span className='mt-1 flex items-center gap-1 text-xs text-[#8b98b8]'>
                <span className='i-mdi-help-circle-outline' /> Help message
              </span>
            </div>
            <div className='rounded-xl border border-[#f3f6fd] bg-white p-4'>
              <label className='mb-1 block text-xs text-[#8b98b8]'>
                Phone Number
              </label>
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                placeholder='+91'
              />
            </div>
            <div className='rounded-xl border border-[#f3f6fd] bg-white p-4'>
              <label className='mb-1 block text-xs text-[#8b98b8]'>Email</label>
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                placeholder='Enter Work Email'
              />
            </div>
            <div className='rounded-xl border border-[#f3f6fd] bg-white p-4'>
              <label className='mb-1 block text-xs text-[#8b98b8]'>
                Company Name
              </label>
              <Input
                className='w-full rounded border border-[#eaf1ff] bg-white px-3 py-2 text-sm'
                placeholder='Enter Work Email'
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
