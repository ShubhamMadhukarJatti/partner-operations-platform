// Utility function to extract participants from document extraction data
export const extractParticipants = (extractionData: any) => {
  if (!extractionData) return []

  console.log('Extracting participants from data:', extractionData)

  // Handle nested data structure - check if data is nested in data.data
  let actualData = extractionData
  if (extractionData.data && typeof extractionData.data === 'object') {
    actualData = extractionData.data
    console.log('Found nested data structure, using data.data:', actualData)

    // Check if there's another level of nesting (data.data.data)
    if (actualData.data && typeof actualData.data === 'object') {
      actualData = actualData.data
      console.log(
        'Found double nested data structure, using data.data.data:',
        actualData
      )
    }
  }

  // Try different possible field names for signers (including signer4_list)
  const possibleSignerFields = [
    'signer1_list',
    'signer2_list',
    'signer3_list',
    'signer4_list',
    'signers',
    'participants',
    'parties',
    'signer1',
    'signer2',
    'signer3',
    'signer4'
  ]

  let allSigners: any[] = []

  // First, try the expected structure with all possible signer lists
  const signerFields = [
    'signer1_list',
    'signer2_list',
    'signer3_list',
    'signer4_list'
  ]
  const hasSignerLists = signerFields.some(
    (field) => actualData[field] && Array.isArray(actualData[field])
  )

  if (hasSignerLists) {
    allSigners = [
      ...(actualData.signer1_list || []),
      ...(actualData.signer2_list || []),
      ...(actualData.signer3_list || []),
      ...(actualData.signer4_list || [])
    ]
    console.log('Found signers in expected structure:', allSigners)
  } else {
    // Try other possible structures
    for (const field of possibleSignerFields) {
      if (actualData[field] && Array.isArray(actualData[field])) {
        allSigners = [...allSigners, ...actualData[field]]
        console.log(`Found signers in field ${field}:`, actualData[field])
      }
    }
  }

  // If still no signers, try to extract from parties_involved
  if (
    allSigners.length === 0 &&
    actualData.parties_involved &&
    Array.isArray(actualData.parties_involved)
  ) {
    allSigners = actualData.parties_involved.map(
      (party: any, index: number) => {
        // Handle both string and object formats
        if (typeof party === 'string') {
          return {
            name: party,
            email: `${party.toLowerCase().replace(/\s+/g, '.')}@example.com`
          }
        }
        return {
          name: party.name || party || `Party ${index + 1}`,
          email:
            party.email ||
            `${party.toLowerCase().replace(/\s+/g, '.')}@example.com`
        }
      }
    )
    console.log('Found signers in parties_involved:', allSigners)
  }

  // If still no signers, try to extract from any array field that might contain participant data
  if (allSigners.length === 0) {
    for (const [key, value] of Object.entries(actualData)) {
      if (Array.isArray(value) && value.length > 0) {
        // Check if the array contains objects with name/email properties
        const hasParticipantStructure = value.some(
          (item: any) =>
            item && (item.name || item.email || typeof item === 'string')
        )

        if (hasParticipantStructure) {
          allSigners = value.map((item: any, index: number) => {
            if (typeof item === 'string') {
              return {
                name: item,
                email: `${item.toLowerCase().replace(/\s+/g, '.')}@example.com`
              }
            }
            return {
              name: item.name || `Participant ${index + 1}`,
              email:
                item.email ||
                `${item.name?.toLowerCase().replace(/\s+/g, '.') || `participant${index + 1}`}@example.com`
            }
          })
          console.log(`Found signers in field ${key}:`, allSigners)
          break
        }
      }
    }
  }

  console.log('Final extracted participants:', allSigners)
  return allSigners
}

// Convert signers to participant format with status
export const convertToParticipants = (signers: any[]) => {
  return signers.map((signer) => ({
    name: signer.name || 'Unknown',
    email: signer.email || 'unknown@example.com',
    status: 'Active' as const
  }))
}
