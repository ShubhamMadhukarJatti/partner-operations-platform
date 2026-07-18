export type OrgData = {
  isPartnershipProgram: { key: string; percentage: number }[]
  companySector: { key: string; percentage: number }[]
  companySize: { key: string; percentage: number }[]
  marketSegment: { key: string; percentage: number }[]
}

export type VennSet = {
  sets: string[]
  size: number
  label: string
}

export const createVennSets = (
  item1: { key: string; percentage: number }[],
  item2: { key: string; percentage: number }[]
): VennSet[] => {
  const vennSets: VennSet[] = []

  // Create the first set for Org 1
  const org1Sectors = item1
    .map((sector) => `${sector.key}: ${sector.percentage.toFixed(2)}%`)
    .join(' ')
  vennSets.push({
    sets: ['Org 1'],
    size: 100,
    label: org1Sectors
  })

  // Create the second set for Org 2
  const org2Sectors = item2
    .map((sector) => `${sector.key}: ${sector.percentage.toFixed(2)}%`)
    .join(' ')
  vennSets.push({
    sets: ['Org 2'],
    size: 100,
    label: org2Sectors
  })

  // Create the common set for Org 1 and Org 2
  const commonSectors = item1.filter((org1Sector) =>
    item2.some((org2Sector) => org1Sector.key === org2Sector.key)
  )

  if (commonSectors.length > 0) {
    const commonLabel = commonSectors.map((sector) => {
      const org2Sector = item2.find((s) => s.key === sector.key)
      const smallerPercentage = Math.min(
        sector.percentage,
        org2Sector?.percentage || 0
      )
      return smallerPercentage // Return the smaller percentage for average calculation
    })

    // Calculate the average
    const averagePercentage =
      commonLabel.length > 0
        ? (
            commonLabel.reduce((acc, curr) => acc + curr, 0) /
            commonLabel.length
          ).toFixed(0)
        : 0

    const commonSize = commonSectors.reduce((sum, sector) => {
      const org2Sector = item2.find((s) => s.key === sector.key)
      return sum + Math.min(sector.percentage, org2Sector?.percentage || 0)
    }, 0)

    vennSets.push({
      sets: ['Org 1', 'Org 2'],
      size: Number(commonSize.toFixed(2)),
      label: averagePercentage.toString()
    })
  }

  return vennSets
}

const sectors = [
  'Tech',
  'Education',
  'Fintech',
  'Healthcare',
  'Retail',
  'Manufacturing'
]
const sizes = ['Small Enterprises', 'Medium Enterprises', 'Large Enterprises']
const segments = ['B2B', 'B2C', 'D2C', 'B2G']
const partnershipPrograms = ['True', 'False']

const getRandomPercentage = () => Number((Math.random() * 100).toFixed(2))

export const generateRandomOrgData = (): OrgData => ({
  isPartnershipProgram: [
    {
      key: partnershipPrograms[
        Math.floor(Math.random() * partnershipPrograms.length)
      ],
      percentage: getRandomPercentage()
    }
  ],
  companySector: [
    {
      key: sectors[Math.floor(Math.random() * sectors.length)],
      percentage: getRandomPercentage()
    },
    {
      key: sectors[Math.floor(Math.random() * sectors.length)],
      percentage: getRandomPercentage()
    }
  ],
  companySize: [
    { key: sizes[Math.floor(Math.random() * sizes.length)], percentage: 100 }
  ],
  marketSegment: [
    {
      key: segments[Math.floor(Math.random() * segments.length)],
      percentage: 100
    }
  ]
})
