import { NextResponse } from 'next/server'
import axios from 'axios'
import { SHA256 } from 'crypto-js'
import { nanoid } from 'nanoid'

import { getBaseUrl } from '@/lib/utils'

export async function POST(request: Request, res: Response) {
  const body = await request.json() // 👈

  const d = new Date()
  let time = d.getTime()
  let baseurl = getBaseUrl()
  const transactionid =
    nanoid().substring(0, 5) + '_' + body.title + '_' + body.orgId

  const payload = {
    merchantId: 'M1NIMWIR8I3Y',
    merchantTransactionId: transactionid,
    merchantUserId: 'MUID' + time,
    amount: body.price * 100,
    // redirectUrl: 'https://sharkdom.com/onboarding-demo?step=5',
    redirectUrl: 'https://sharkdom.com/explore',
    redirectMode: 'REDIRECT',
    callbackUrl: process.env.NEXT_PUBLIC_SHARKDOM_API_URL + '/payment/callback',
    // mobileNumber: '',
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  }

  const dataPayload = JSON.stringify(payload)
  const dataBase64 = Buffer.from(dataPayload).toString('base64')
  const saltKey = 'bc83ad33-9f46-4f16-b0f2-a7e40dd30ec0'
  const fullURL = dataBase64 + '/pg/v1/pay' + saltKey
  const dataSha256 = SHA256(fullURL)
  const key_index = 1
  const checksum = dataSha256 + '###' + key_index

  let resp
  const options = {
    method: 'post',
    url: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-VERIFY': checksum
    },
    data: {
      request: dataBase64
    }
  }
  await axios
    .request(options)
    .then(function (response) {
      resp = response.data
    })
    .catch(function (error) {
      console.error('rror :: err', error)
      resp = error
    })

  return NextResponse.json({ data: resp })
}
