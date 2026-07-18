import { headers } from 'next/headers'
import querystring from 'querystring'
import axios from 'axios'

import { getCurrentOrganization } from '@/lib/db/organization'

import ExternalButton from './components/ExternalButton'

export default function page({
  params,
  searchParams
}: {
  params: { code: string }
  searchParams?: { [code: string]: string | string[] | undefined }
}) {
  console.log('code-->', searchParams?.code)
  const headersList = headers()
  // console.log('headersList',type)
  const getUser = async () => {
    const res = await getCurrentOrganization()
  }
  getUser()

  const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL

  const clientId = '8a268119-e243-4051-bab8-9cb69888ef3c'

  // const clientSecret = '961a6f3f-970e-43e1-a05b-bc3c051e49e3';

  const handleAuth = async () => {
    let code = searchParams?.code
    if (code) {
      const tokenUrl = 'https://api.hubapi.com/oauth/v1/token'

      const payload = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code
      }
      console.log('before', payload)

      console.log('after', payload.toString())
      try {
        const tokenResponse = await axios.post(
          tokenUrl,
          querystring.stringify(payload)
        )
        console.log('tokenResponse', tokenResponse)
        // const tokenResponse = await fetch(tokenUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: new URLSearchParams(data),
        // });

        // if (!tokenResponse.ok) {
        //     throw new Error(`Error exchanging authorization code: ${tokenResponse.statusText}`);
        // }

        // const tokenData = await tokenResponse.json();
        const tokenData: any = tokenResponse.data
        const accessToken = tokenData.access_token
        createCompaniesAndContacts(accessToken)
        return
        console.log('Access Token:', accessToken)

        const contactsArray = [
          {
            email: 'ashish1@example.com',
            firstname: 'Ashish1',
            lastname: 'S1',
            password: 'password1'
          },
          {
            email: 'rohit2@example.com',
            firstname: 'Rohit2',
            lastname: 'S2',
            password: 'password2'
          },
          {
            email: 'raj3@example.com',
            firstname: 'Raj3',
            lastname: 'S3',
            password: 'password3'
          },
          {
            email: 'vikas4@example.com',
            firstname: 'Vikas4',
            lastname: 'S4',
            password: 'password4'
          },
          {
            email: 'deepak5@example.com',
            firstname: 'Deepak5',
            lastname: 'S5',
            password: 'password5'
          },
          {
            email: 'ajay6@example.com',
            firstname: 'Ajay6',
            lastname: 'S6',
            password: 'password6'
          },
          {
            email: 'amit7@example.com',
            firstname: 'Amit7',
            lastname: 'S7',
            password: 'password7'
          },
          {
            email: 'anil8@example.com',
            firstname: 'Anil8',
            lastname: 'S8',
            password: 'password8'
          },
          {
            email: 'manish9@example.com',
            firstname: 'Manish9',
            lastname: 'S9',
            password: 'password9'
          },
          {
            email: 'suresh10@example.com',
            firstname: 'Suresh10',
            lastname: 'S10',
            password: 'password10'
          },
          {
            email: 'ramesh11@example.com',
            firstname: 'Ramesh11',
            lastname: 'S11',
            password: 'password11'
          },
          {
            email: 'sanjay12@example.com',
            firstname: 'Sanjay12',
            lastname: 'S12',
            password: 'password12'
          },
          {
            email: 'vijay13@example.com',
            firstname: 'Vijay13',
            lastname: 'S13',
            password: 'password13'
          },
          {
            email: 'alok14@example.com',
            firstname: 'Alok14',
            lastname: 'S14',
            password: 'password14'
          },
          {
            email: 'kumar15@example.com',
            firstname: 'Kumar15',
            lastname: 'S15',
            password: 'password15'
          },
          {
            email: 'prashant16@example.com',
            firstname: 'Prashant16',
            lastname: 'S16',
            password: 'password16'
          },
          {
            email: 'abhishek17@example.com',
            firstname: 'Abhishek17',
            lastname: 'S17',
            password: 'password17'
          },
          {
            email: 'arun18@example.com',
            firstname: 'Arun18',
            lastname: 'S18',
            password: 'password18'
          },
          {
            email: 'sachin19@example.com',
            firstname: 'Sachin19',
            lastname: 'S19',
            password: 'password19'
          },
          {
            email: 'tarun20@example.com',
            firstname: 'Tarun20',
            lastname: 'S20',
            password: 'password20'
          }
        ]

        let contactData: any = []
        contactsArray.forEach(async (contact, i) => {
          contactData = {
            properties: [
              { property: 'email', value: contact.email },
              { property: 'firstname', value: contact.firstname },
              { property: 'lastname', value: contact.lastname }
            ]
          }
          const contactResponse = await fetch(
            'https://api.hubapi.com/contacts/v1/contact',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify(contactData)
            }
          )
          const contactResult = await contactResponse.json()
          console.log('Contact created:' + i, contactResult)
        })

        // if (!contactResponse.ok) {
        //     throw new Error(`Error creating contact: ${contactResponse.statusText}`);
        // }
      } catch (error: any) {
        console.error('catch', error)
      }
    }
  }

  interface Contact {
    email: string
    firstname: string
    lastname: string
    password: string
    orgID: number
  }
  const data: Contact[] = [
    {
      email: 'ashish1@example0.com',
      firstname: 'Ashish1',
      lastname: 'S1',
      password: 'password1',
      orgID: 0
      // companyEmail: 'example0.com'
    },
    {
      email: 'rohit2@example.com',
      firstname: 'Rohit2',
      lastname: 'S2',
      password: 'password2',
      orgID: 0
    },
    {
      email: 'raj3@example.com',
      firstname: 'Raj3',
      lastname: 'S3',
      password: 'password3',
      orgID: 0
    },
    {
      email: 'vikas4@example.com',
      firstname: 'Vikas4',
      lastname: 'S4',
      password: 'password4',
      orgID: 0
    },
    {
      email: 'deepak5@example.com',
      firstname: 'Deepak5',
      lastname: 'S5',
      password: 'password5',
      orgID: 0
    },
    {
      email: 'ajay6@example.com',
      firstname: 'Ajay6',
      lastname: 'S6',
      password: 'password6',
      orgID: 0
    },
    {
      email: 'amit7@example.com',
      firstname: 'Amit7',
      lastname: 'S7',
      password: 'password7',
      orgID: 2
    },
    {
      email: 'anil8@example.com',
      firstname: 'Anil8',
      lastname: 'S8',
      password: 'password8',
      orgID: 0
    },
    {
      email: 'manish9@example.com',
      firstname: 'Manish9',
      lastname: 'S9',
      password: 'password9',
      orgID: 0
    },
    {
      email: 'suresh10@example.com',
      firstname: 'Suresh10',
      lastname: 'S10',
      password: 'password10',
      orgID: 0
    },
    {
      email: 'ramesh11@example.com',
      firstname: 'Ramesh11',
      lastname: 'S11',
      password: 'password11',
      orgID: 2
    },
    {
      email: 'sanjay12@example.com',
      firstname: 'Sanjay12',
      lastname: 'S12',
      password: 'password12',
      orgID: 0
    },
    {
      email: 'vijay13@example.com',
      firstname: 'Vijay13',
      lastname: 'S13',
      password: 'password13',
      orgID: 0
    },
    {
      email: 'alok14@example.com',
      firstname: 'Alok14',
      lastname: 'S14',
      password: 'password14',
      orgID: 2
    },
    {
      email: 'kumar15@example.com',
      firstname: 'Kumar15',
      lastname: 'S15',
      password: 'password15',
      orgID: 0
    },
    {
      email: 'prashant16@example.com',
      firstname: 'Prashant16',
      lastname: 'S16',
      password: 'password16',
      orgID: 0
    },
    {
      email: 'abhishek17@example.com',
      firstname: 'Abhishek17',
      lastname: 'S17',
      password: 'password17',
      orgID: 3
    },
    {
      email: 'arun18@example.com',
      firstname: 'Arun18',
      lastname: 'S18',
      password: 'password18',
      orgID: 0
    },
    {
      email: 'sachin19@example.com',
      firstname: 'Sachin19',
      lastname: 'S19',
      password: 'password19',
      orgID: 3
    },
    {
      email: 'tarun20@example.com',
      firstname: 'Tarun20',
      lastname: 'S20',
      password: 'password20',
      orgID: 3
    }
  ]
  const createCompany = async (
    orgID: number,
    hubspotApiKey: string
  ): Promise<number | null> => {
    try {
      const response = await axios.post(
        'https://api.hubapi.com/companies/v2/companies',
        {
          properties: [
            { name: 'name', value: `Company ${orgID}` },
            { name: 'description', value: `Organization id is ${orgID}` }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`Company created successfully for orgID ${orgID}`)
      return response.data.companyId
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error creating company for orgID ${orgID}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(
          `Unexpected error creating company for orgID ${orgID}:`,
          error
        )
      }
      return null
    }
  }

  const createContact = async (
    contact: Contact,
    hubspotApiKey: string
  ): Promise<number | null> => {
    try {
      const response = await axios.post(
        'https://api.hubapi.com/contacts/v1/contact',
        {
          properties: [
            { property: 'email', value: contact.email },
            { property: 'firstname', value: contact.firstname },
            { property: 'lastname', value: contact.lastname }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(`Contact created successfully for email ${contact.email}`)
      return response.data.vid
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error creating contact for email ${contact.email}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(
          `Unexpected error creating contact for email ${contact.email}:`,
          error
        )
      }
      return null
    }
  }

  const associateContactToCompany = async (
    contactId: number,
    companyId: number,
    hubspotApiKey: string
  ) => {
    try {
      await axios.put(
        'https://api.hubapi.com/crm-associations/v1/associations',
        {
          fromObjectId: contactId,
          toObjectId: companyId,
          definitionId: 1 // 1 is the default definition ID for contact-to-company in HubSpot
        },
        {
          headers: {
            Authorization: `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(
        `Contact ID ${contactId} associated with company ID ${companyId}`
      )
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(
          'Errorrr->',
          JSON.stringify({
            fromObjectId: contactId,
            toObjectId: companyId,
            definitionId: 1 // 1 is the default definition ID for contact-to-company in HubSpot
          })
        )
        console.error(
          `Error associating contact ID ${contactId} with company ID ${companyId}:`,
          error.response?.data || error.message
        )
      } else {
        console.error(
          `Unexpected error associating contact ID ${contactId} with company ID ${companyId}:`,
          error
        )
      }
    }
  }

  const createCompaniesAndContacts = async (hubspotApiKey: string) => {
    try {
      // Create a set of unique orgIDs
      const uniqueOrgIDs = [...new Set(data.map((contact) => contact.orgID))]

      // Create companies and map orgID to companyId
      const companyIdMap: { [key: number]: number } = {}
      for (const orgID of uniqueOrgIDs) {
        const companyId = await createCompany(orgID, hubspotApiKey)
        if (companyId) {
          companyIdMap[orgID] = companyId
        } else {
          console.error(
            `Skipping company creation for orgID ${orgID} due to error`
          )
        }
      }

      // Create contacts and associate them with companies
      data.map(async (contact) => {
        const contactId = await createContact(contact, hubspotApiKey)
        const companyId = companyIdMap[contact.orgID]
        if (contactId && companyId) {
          await associateContactToCompany(contactId, companyId, hubspotApiKey)
        } else {
          console.error(
            `Skipping contact creation or association for email ${contact.email} due to error`
          )
        }
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error integrating with HubSpot:',
          error.response?.data || error.message
        )
      } else {
        console.error('Unexpected error integrating with HubSpot:', error)
      }
    }
  }
  if (searchParams?.code) {
    handleAuth()
  }

  return (
    <div>
      <ExternalButton />
    </div>
  )
}
