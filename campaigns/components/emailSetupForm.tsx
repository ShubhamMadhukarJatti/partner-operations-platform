import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { OutlinedInput } from '@/components/ui/outlined-input'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  domain: z.string().min(1, 'Domain name is required')
})

export type EmailSetupFormValuesTypes = z.infer<typeof formSchema>

export function EmailSetupForm({
  onClickStepOneNextBtn
}: {
  onClickStepOneNextBtn: (values: EmailSetupFormValuesTypes) => void
}) {
  const form = useForm<EmailSetupFormValuesTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      domain: ''
    }
  })

  function onSubmit(values: EmailSetupFormValuesTypes) {
    onClickStepOneNextBtn(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-center space-y-6'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OutlinedInput
                  labelClassName='text-sm font-normal text-text-60 lg:text-shark-sm 2xl:text-shark-lg'
                  label='Email Address'
                  placeholder='username@companyname.com'
                  className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='domain'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OutlinedInput
                  labelClassName='text-sm font-normal text-text-60 lg:text-shark-sm 2xl:text-shark-lg'
                  label='Domain Name'
                  placeholder='companyname.com'
                  className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='mx-auto w-32 rounded-lg bg-[#0062F1] px-4 py-3 font-medium text-white hover:bg-[#0062F1]'
        >
          Next
        </Button>
      </form>
    </Form>
  )
}
