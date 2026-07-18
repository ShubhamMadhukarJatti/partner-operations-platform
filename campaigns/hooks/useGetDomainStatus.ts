import { useEffect, useState } from 'react'
import axios from 'axios'

interface VerificationRecord {
  type: string
  name: string
  value: string
  ttl: number
}

interface DkimRecord {
  type: string
  name: string
  value: string
  ttl: number
}

interface DnsRecords {
  verificationRecord: VerificationRecord
  dkimRecords: DkimRecord[]
}

export interface DomainStatusResponse {
  success: boolean
  domain: string
  status: string
  dnsRecords: DnsRecords
}

const useDomainStatus = (domain: string) => {
  const [data, setData] = useState<DomainStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDomainStatus = async () => {
      if (!domain) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get<DomainStatusResponse>(
          `/api/email/domain-status/${domain}`
        )

        setData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDomainStatus()
  }, [domain])

  return { isLoading, error, data }
}

export default useDomainStatus
