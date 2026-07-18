import { getHubspotDataBasedOnColumns } from './src/lib/db/customer-persona'

async function test() {
  const data = await getHubspotDataBasedOnColumns(
    1582,
    ['firstname', 'email', 'jobtitle'],
    'PROSPECT'
  )
  console.log(JSON.stringify(data, null, 2))
}
test()
