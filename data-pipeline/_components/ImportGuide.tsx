import { Building2, Download, MapPin, User } from 'lucide-react'

const FIELDS = [
  { label: 'Any lead field', required: true, icon: MapPin },
  { label: 'Person - Name', required: true, icon: User },
  { label: 'Person - Email', hint: '(suggested)', icon: User },
  { label: 'Person - Phone', hint: '(suggested)', icon: User },
  { label: 'Organization - Name', required: true, icon: Building2 },
  { label: 'Organization - Address', hint: '(suggested)', icon: Building2 }
] as const

const TABLE_HEADERS = [
  { label: 'Person - N…', required: true },
  { label: 'Person - Email', required: false },
  { label: 'Person - Pho…', required: false },
  { label: 'Organizatio…', required: true },
  { label: 'Organization …', required: false },
  { label: 'Lead - Title', required: true }
]

const TABLE_ROWS = [
  [
    'Tony Turner',
    'tony.turner@…',
    '570-809-7197',
    'Moveer Limit…',
    '5, 943 Finch…',
    'Moveer Lead'
  ],
  [
    'Hashim Handy',
    'hashim.hardy…',
    '240-707-3884',
    'ABC Inc',
    '9974 Pleasan…',
    'ABC Lead'
  ],
  [
    'Phyllis Yang',
    'phyllis.yang…',
    '313-428-3135',
    'Silicon Links …',
    '7938 Dewy P…',
    'Silicon Lead'
  ]
]

export default function ImportGuide() {
  return (
    <div className='flex flex-1 flex-col gap-4 overflow-y-auto rounded-r-lg bg-[#F7F5FF] p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-[#6150E1]'>Import guide</h3>
        <button className='flex items-center gap-1 text-sm font-medium text-[#3E50F7] hover:opacity-80'>
          <Download className='h-5 w-5' />
          Download template
        </button>
      </div>

      {/* Subtitle */}
      <p className='text-[11.8px] font-medium text-[#65686F]'>
        These fields are mandatory for your selected data import
      </p>

      {/* Field list */}
      <div className='flex flex-col divide-y divide-[rgba(33,35,44,0.08)]'>
        {FIELDS.map((field) => (
          <div
            key={field.label}
            className='flex items-center gap-2 bg-white px-2 py-2'
          >
            <field.icon className='h-4 w-4 shrink-0 text-[#21232C]' />
            <span className='text-[13.9px] font-medium text-[#21232C]'>
              {field.label}
            </span>
            {'required' in field && field.required && (
              <span className='text-sm font-medium text-[#C82627]'>*</span>
            )}
            {'hint' in field && field.hint && (
              <span className='text-[13.9px] font-medium text-[#65686F]'>
                {field.hint}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Spreadsheet example label */}
      <p className='text-[11.8px] font-medium text-[#65686F]'>
        Spreadsheet example
      </p>

      {/* Table */}
      <div className='overflow-x-auto rounded outline outline-1 outline-[rgba(33,35,44,0.12)]'>
        {/* Header row */}
        <div className='flex border-b border-[rgba(33,35,44,0.12)]'>
          {TABLE_HEADERS.map((col, i) => {
            const isLast = i === TABLE_HEADERS.length - 1
            return (
              <div
                key={i}
                className={`flex items-center gap-0.5 bg-[#F5F5F6] px-2 py-2 ${
                  isLast
                    ? 'flex-1'
                    : 'w-[118px] shrink-0 border-r border-[rgba(33,35,44,0.12)]'
                }`}
              >
                <span className='truncate text-sm font-medium text-[#21232C]'>
                  {col.label}
                </span>
                {col.required && (
                  <span className='shrink-0 text-sm text-[#C82627]'>*</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Data rows */}
        {TABLE_ROWS.map((row, ri) => (
          <div
            key={ri}
            className={`flex ${ri < TABLE_ROWS.length - 1 ? 'border-b border-[rgba(33,35,44,0.12)]' : ''}`}
          >
            {row.map((cell, ci) => {
              const isLast = ci === row.length - 1
              return (
                <div
                  key={ci}
                  className={`bg-white px-2 py-2 ${
                    isLast
                      ? 'flex-1'
                      : 'w-[118px] shrink-0 border-r border-[rgba(33,35,44,0.12)]'
                  }`}
                >
                  <span className='block truncate text-[13.9px] font-medium text-[#65686F]'>
                    {cell}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
