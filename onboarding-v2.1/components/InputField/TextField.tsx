import TextField from '@mui/material/TextField'

interface CustomTextFieldProps {
  label: string
  placeholder?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function CustomTextField({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange
}: CustomTextFieldProps) {
  return (
    <div className='w-full space-y-2'>
      {/* Heading */}
      <p className='text-sm font-semibold text-gray-700'>{label}</p>
      <TextField
        fullWidth
        type={type}
        // label={placeholder}
        variant='outlined'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          sx: {
            borderRadius: '8px',
            height: '40px',
            backgroundColor: '#fff', // gray when empty
            '& fieldset': {
              borderColor: value ? '#F3F3F5' : 'transparent'
            },
            '&:hover fieldset': {
              borderColor: value ? '#F3F3F5' : 'transparent'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3E50F7' // on focus
            }
          }
        }}
      />
    </div>
  )
}
