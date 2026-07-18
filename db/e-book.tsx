'use server'

import { fetcher } from '@/lib/server'

export const sendEBook = async (email: string) => {
  try {
    const data = await fetcher<any>('/email/sendOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        recipients: [email],
        bodyHtml: 'shareable_e-book',
        bodyText: 'string',
        subject: 'string',
        s3AttachmentNames: ["sharkdom-partnership-guide_for_CXO's.pdf"]
      }
    })

    return { status: 200, data }
  } catch (error: any) {
    return { status: 500, msg: error?.message ?? 'Unknown error' }
  }
}
