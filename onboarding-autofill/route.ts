import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const body = await req.json()

  const url = `https://sharkdom-automation.azurewebsites.net/automation/`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Accept: '*/*',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (response.status !== 200) {
      return NextResponse.json(
        { message: response.statusText },
        { status: response.status }
      )
    }

    if (data) {
      const formattedData = {
        about: data['Description of the Startup'].substring(0, 150),
        companyType: data['Market Segment'],
        briefDescription: data['One-line Description'],
        sector: data['Sector of the Company'],
        isAgency: data['Is_Agency'] === 'True' ? true : false
        // preferredPartnerships: data['Preferred Partnerships'].split(', '),
        // idealPartnerSector: data['Sector of the Ideal Company for Partnership']
      }
      return NextResponse.json(formattedData, { status: 200 })
    }
    console.log(data, 'data inside server')
  } catch (error: any) {
    return NextResponse.error()
  }
}
