import { NextResponse } from 'next/server'

// const uploadFile = async () => {
//   const url = `https://content.zohoapis.com/crm/v2/upload`;
// }

// Helper function to upload the CSV file to Zoho
async function uploadCSVFile(
  csvData: string,
  accessToken: string
): Promise<string> {
  const form = new FormData()
  const blob = new Blob([csvData], { type: 'text/csv' })
  form.append('file', blob, 'contacts.csv')

  console.log(`Zoho-oauthtoken ${accessToken}`)
  // const response = await fetch('https://content.zohoapis.in/crm/v2.1/upload', {
  const response = await fetch('https://content.zohoapis.in/crm/v2/upload', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      feature: 'bulk-write'
      // 'Content-Type': 'application/json'
    },
    body: form
  })

  const data = await response.json()
  if (!response.ok) {
    console.log(data)
    throw new Error(`Error uploading CSV: ${data}`)
  }

  return data?.data?.[0]?.details?.id
}

// Helper function to create the bulk write job in Zoho
async function createBulkWriteJob(fileId: string, accessToken: string) {
  // const response = await fetch('https://www.zohoapis.in/crm/bulk/v2/write', {
  const response = await fetch('https://www.zohoapis.in/crm/bulk/v2/write', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operation: 'insert',
      resource: [
        {
          type: 'data',
          module: 'Contacts',
          file_id: fileId,
          file_type: 'csv',
          ignore_empty: true,
          find_by: 'Email'
        }
      ]
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Error creating bulk write job: ${data}`)
  }

  return data
}

export async function POST(req: Request, res: Response) {
  // const body = await req.text() // Read the raw text of the body
  // const parsedBody = parse(body) // Parse the URL-encoded string into an object

  try {
    const body = await req.json()
    const { contacts, accessToken } = body // Assume contacts are passed in request body as JSON array

    // Prepare CSV data
    const csvHeader = 'Email,Full_Name,Last_Name\n'
    const csvRows = contacts.map(
      (contact: { email: string; name: string }) =>
        `${contact.email},${contact.name}`
    )
    const csvData = csvHeader + csvRows.join('\n')

    // Upload the CSV file and get the file ID
    const fileId = await uploadCSVFile(csvData, accessToken)

    // Create the bulk write job with the uploaded file ID
    const bulkWriteResponse = await createBulkWriteJob(fileId, accessToken)

    // Send the response back to the client
    // res.json({
    //   message: 'Bulk write job created successfully',
    //   data: bulkWriteResponse,
    // });
    NextResponse.json(
      {
        message: 'Bulk write job created successfully',
        data: bulkWriteResponse
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 404 })
  }
}
