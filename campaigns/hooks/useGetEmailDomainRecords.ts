import { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { useSelector } from 'react-redux'

export type DnsRecord = {
  type: string
  name: string
  value: string
  ttl: number
}

type DnsRecordsResponse = {
  organizationId: string | null
  domain: string
  email: string
  dnsRecords: {
    verificationRecord: DnsRecord
    dkimRecords: DnsRecord[]
  }
  emailVerified: boolean
  verified: boolean
}

type UseEmailDomainRecordsResult = {
  loading: boolean
  error: string | null
  TXTRecords: DnsRecord | null
  CNAMERecords: DnsRecord[] | null
  domain: string | null
  isVerified: boolean
}

export const useEmailDomainRecords = (): UseEmailDomainRecordsResult => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loading: orgLoading, organization } = useSelector(
    (state: RootState) => state.currentOrg
  )
  const [TXTRecords, setTXTRecords] = useState<DnsRecord | null>(null)
  const [CNAMERecords, setCNAMERecords] = useState<DnsRecord[] | null>(null)
  const [domain, setDomain] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  useEffect(() => {
    const fetchEmailDomainRecords = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get<DnsRecordsResponse>(
          `/api/email/domain?organizationId=${organization.id}`
        )

        const dnsRecords = response.data.dnsRecords
        setDomain(response.data.domain)
        setTXTRecords(dnsRecords.verificationRecord)
        setCNAMERecords(dnsRecords.dkimRecords)
        setIsVerified(response.data.verified)
      } catch (err: any) {
        setError(err?.message || 'Something went wrong!')
      } finally {
        setLoading(false)
      }
    }

    if (organization.id) {
      fetchEmailDomainRecords()
    }
  }, [organization])

  return { loading, error, TXTRecords, CNAMERecords, domain, isVerified }
}
