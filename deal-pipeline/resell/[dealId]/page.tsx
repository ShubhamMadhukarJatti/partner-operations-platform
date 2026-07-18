'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { ArrowRight } from 'iconsax-react'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  CreditCard,
  FileText,
  Filter,
  HistoryIcon,
  Info,
  Loader,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Shield,
  Upload,
  Users,
  X as XIcon
} from 'lucide-react'
import Papa from 'papaparse'
import { useSelector } from 'react-redux'

import { fetchconnectedApps } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { DealHistoryDrawer } from '@/components/deal-history-drawer'
import MapProperties from '@/app/(app)/(dashboard-pages)/customer-persona/_components/map-properties'

import AssignLicenseModal from './_components/AssignLicenseModal'
import LicensesDetailsCard from './_components/LicensesDetailsCard'

// This is the Resell Deal Details page - separate from Cosell deals

interface Deal {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  customerAccountName: string
  dealId: string
  dealCode: string
  website: string
  headQuarterLocation: string
  estimatedAcv: number
  expectedClosingTime: number
  currentSolution: string
  requirements: string
  customFields: string
  dealStage: string
  source: string
  isApproved: boolean
  dealerOrgId: number
  vendorOrgId: number
  dealProtectionPeriod: number
  isSent: boolean
  customFieldsMap: Record<string, { value: any; dataType: string }>
  hotspotDealId: string
}

interface ResellerDealDetails {
  id: number
  resellerOrgId: number
  vendorOrgId: number
  partnerName: string
  expectedReleaseTime: number
  expectedReleaseDate: string
  resellerMode: string
  productPlanRequired: string
  numberOfLicences: number
  calculatedPartnerTier: string | null
  billingModel: string
  actualPrice: number
  buyPrice: number
  poc: string
  resellerDealStatus: string
  resellerDealStag: string
  resellerDealSource: string
}

interface LicenseDetails {
  licensesPurchased: number
  licensesAllocated: number
  licensesRemaining: number
  licensesConsumed: number
}

interface Customer {
  id: number
  customer: string
  expiry: string
  status: string
  email: string
}

interface Partner {
  orgId: number
  name: string
}

interface StripePaymentData {
  id: number
  resellerId: number
  requestId: number
  vendorOrgId: number
  stripeSessionId?: string
  checkoutUrl?: string
  paymentStatus: string
  amount: number
  customerEmail?: string
  [key: string]: unknown
}

interface Country {
  code: string
  name: string
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dealProtectionPeriod, setDealProtectionPeriod] = useState(90)
  const [showModal, setShowModal] = useState(false)
  const [isHubSpotConnected, setIsHubSpotConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [hubspotApp, setHubspotApp] = useState<any>(null)
  const { organization } = useSelector((state: RootState) => state.currentOrg)
  const currentOrgId = organization?.id
  const [history, setHistory] = useState<any>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [errorHistory, setErrorHistory] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [connectedApps, setConnectedApps] = useState<string[]>([])
  const [selectedCRM, setSelectedCRM] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('opportunity-details')
  const [isApproving, setIsApproving] = useState(false)
  const [resellerDealDetails, setResellerDealDetails] =
    useState<ResellerDealDetails | null>(null)
  const [licenseDetails, setLicenseDetails] = useState<LicenseDetails | null>(
    null
  )
  const [loadingLicenseDetails, setLoadingLicenseDetails] = useState(false)

  // License Allocation state
  const [searchQuery, setSearchQuery] = useState('')
  const [licenseStatusFilter, setLicenseStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [showImportCustomerModal, setShowImportCustomerModal] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [addingCustomer, setAddingCustomer] = useState(false)
  const [customerFormData, setCustomerFormData] = useState({
    customerName: '',
    email: ''
  })
  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvColumns, setCsvColumns] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [importingCustomers, setImportingCustomers] = useState(false)
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({
    'Customer name': '',
    Email: ''
  })
  const csvFileInputRef = useRef<HTMLInputElement>(null)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [assignLicenseModal, setAssignLicenseModal] = useState<{
    open: boolean
    email: string
    customerName?: string
    customerId?: number
  }>({
    open: false,
    email: ''
  })
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(
    null
  )
  const [stripePaymentData, setStripePaymentData] =
    useState<StripePaymentData | null>(null)
  const [loadingStripePayment, setLoadingStripePayment] = useState(false)
  const [generatingPaymentLink, setGeneratingPaymentLink] = useState(false)
  const itemsPerPage = 10

  // Memoize organization ID to prevent unnecessary effect triggers
  const organizationId = useMemo(() => currentOrgId, [currentOrgId])

  // Check if current user is a vendor (matches vendorOrgId from API)
  const isVendor = useMemo(() => {
    return currentOrgId && resellerDealDetails?.vendorOrgId
      ? currentOrgId === resellerDealDetails.vendorOrgId
      : false
  }, [currentOrgId, resellerDealDetails?.vendorOrgId])

  const showLicenseAllocationTab =
    isVendor && stripePaymentData?.paymentStatus === 'SUCCESS'

  // Reset to opportunity-details when license tab is hidden but currently selected
  useEffect(() => {
    if (activeTab === 'license-allocation' && !showLicenseAllocationTab) {
      setActiveTab('opportunity-details')
    }
  }, [activeTab, showLicenseAllocationTab])

  // Helper function to map API customer data to Customer interface
  const mapCustomerData = (customer: any): Customer => {
    // Determine status based on licenseStatus or licenseAssigned
    let status = 'Not Assigned'
    if (customer.licenseStatus) {
      // Convert API licenseStatus to display status
      status =
        customer.licenseStatus === 'ASSIGNED' ? 'Assigned' : 'Not Assigned'
    } else if (customer.licenseAssigned === true) {
      status = 'Assigned'
    }

    // Format expiry date if available
    let expiry = ''
    if (customer.expiryDate) {
      // Indian date format: dd/mm/yyyy
      expiry = new Date(customer.expiryDate).toLocaleDateString('en-IN')
    }

    return {
      id: customer.customerId || customer.id, // Use customerId as primary, fallback to id
      customer: customer.customerName,
      email: customer.email,
      status: status,
      expiry: expiry
    }
  }

  // Mock conflicts data for Conflicts tab
  const [conflicts, setConflicts] = useState([
    {
      id: 'account-exists',
      title: 'Account already exist in CRMs',
      count: 1,
      details: {
        accountName: 'Global Solution',
        owner: 'Jhon Doe',
        stage: 'In Pipeline',
        lastActivity: '29 Nov',
        region: 'Chennai'
      },
      resolutionText:
        'You can link the CRM and the system automatically checks if this is the same customer.'
    },
    {
      id: 'opportunity-exists',
      title: 'An opportunity already exists for this account',
      count: 3
    },
    {
      id: 'partner-registered',
      title: 'Another partner has already registered this deal',
      count: 3
    },
    {
      id: 'territory',
      title: "Not assigned to this partner's territory",
      count: 3
    },
    {
      id: 'already-submitted',
      title: 'This deal was already submitted',
      count: 3
    }
  ])

  // Track dismissed conflicts
  const [dismissedConflicts, setDismissedConflicts] = useState<Set<string>>(
    new Set()
  )

  // Filter license data (client-side filtering for search and status)
  const filteredLicenseData = customers.filter((item) => {
    const matchesSearch =
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      licenseStatusFilter === 'all' || item.status === licenseStatusFilter
    return matchesSearch && matchesStatus
  })

  // Use API pagination totalPages, but also support client-side filtering
  const displayTotalPages =
    searchQuery || licenseStatusFilter !== 'all'
      ? Math.ceil(filteredLicenseData.length / itemsPerPage)
      : totalPages
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLicenseData =
    searchQuery || licenseStatusFilter !== 'all'
      ? filteredLicenseData.slice(startIndex, endIndex)
      : customers.slice(startIndex, endIndex)

  const handleDismissConflict = (conflictId: string) => {
    setDismissedConflicts((prev) => new Set(prev).add(conflictId))
  }

  // Helper function to format CRM names for display
  const formatCRMName = (type: string): string => {
    const nameMap: Record<string, string> = {
      G_CALENDAR: 'Google Calendar',
      G_SHEET: 'Google Sheet',
      G_FORM: 'Google Form',
      HUBSPOT: 'HubSpot',
      TRELLO: 'Trello'
    }
    return nameMap[type] || type
  }

  // Check HubSpot connection status and fetch all connected apps
  useEffect(() => {
    const checkHubSpotConnection = async () => {
      try {
        setCheckingConnection(true)

        // Fetch connected apps from new API endpoint
        const response = await fetch('/api/organization/connected/types', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch connected apps')
        }
        const connectedTypes: string[] = await response.json()

        if (connectedTypes.length == 0) {
          setShowModal(true)
        } else {
          console.log('connectedTypes', connectedTypes)
          // Store all connected apps
          setConnectedApps(connectedTypes)
        }

        // Set default selected CRM if available (prioritize CRM apps)
        const crmApps = connectedTypes.filter(
          (type) => type === 'HUBSPOT' || type === 'TRELLO'
        )
        if (crmApps.length > 0) {
          setSelectedCRM(crmApps[0])
          setShowModal(false)
        } else if (connectedTypes.length > 0) {
          setSelectedCRM(connectedTypes[0])
        }

        // Check HubSpot connection for backward compatibility
        const isHubSpotConnected = connectedTypes.includes('HUBSPOT')
        setIsHubSpotConnected(isHubSpotConnected)

        // Fetch detailed HubSpot app data if needed
        const apps = await fetchconnectedApps()
        const hubspotAppData = apps.find(
          (app: any) => app.integrationType === 'HUBSPOT'
        )
        setHubspotApp(hubspotAppData)

        // Add delay before showing modal to ensure correct status
        setTimeout(() => {
          if (!isHubSpotConnected && deal && !deal.isApproved) {
            setShowModal(true)
          }
          setCheckingConnection(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching connected apps:', error)
        setCheckingConnection(false)
      }
    }

    // Only check CRM connection if user is a vendor
    if (deal && currentOrgId && token && resellerDealDetails) {
      const userIsVendor = currentOrgId === resellerDealDetails.vendorOrgId
      if (userIsVendor) {
        checkHubSpotConnection()
      } else {
        setCheckingConnection(false)
      }
    }
  }, [deal, currentOrgId, token, resellerDealDetails])

  // Fetch deal details from API
  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user and token
        const { token: serverToken } = await getServerUser()
        setToken(serverToken)

        const dealId = params.dealId as string
        if (!dealId) {
          setError('Deal ID is required')
          setLoading(false)
          return
        }

        // Fetch deal details
        const dealResponse = await fetch(
          `/api/reseller/deals/details/${dealId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!dealResponse.ok) {
          const errorText = await dealResponse.text()
          throw new Error(
            `Failed to fetch deal details: ${dealResponse.status} - ${errorText}`
          )
        }

        const dealResult = await dealResponse.json()
        if (dealResult.success && dealResult.data) {
          const dealData = dealResult.data
          setResellerDealDetails(dealData)

          // Map API response to Deal interface for compatibility
          const mappedDeal: Deal = {
            id: dealData.id,
            creationTimestamp: '',
            lastUpdatedTimestamp: '',
            customerAccountName: dealData.partnerName || 'N/A',
            dealId: dealData.id.toString(),
            dealCode: '',
            website: '',
            headQuarterLocation: '',
            estimatedAcv: 0,
            expectedClosingTime: dealData.expectedReleaseTime,
            currentSolution: '',
            requirements: '',
            customFields: '',
            dealStage: dealData.resellerDealStag || '',
            source: dealData.resellerDealSource || '',
            isApproved: dealData.resellerDealStatus === 'ACTIVE',
            dealerOrgId: dealData.resellerOrgId,
            vendorOrgId: dealData.vendorOrgId,
            dealProtectionPeriod: 90,
            isSent: false,
            customFieldsMap: {},
            hotspotDealId: ''
          }
          setDeal(mappedDeal)
        } else {
          throw new Error('Invalid response format from deal details API')
        }
      } catch (error: any) {
        console.error('Error fetching deal details:', error)
        setError(error.message || 'Failed to load deal details')
      } finally {
        setLoading(false)
      }
    }

    fetchDealDetails()
  }, [params.dealId])

  // Fetch license details from API
  useEffect(() => {
    const fetchLicenseDetails = async () => {
      try {
        setLoadingLicenseDetails(true)
        const dealId = params.dealId as string
        if (!dealId) {
          return
        }

        const licenseResponse = await fetch(
          `/api/reseller/deals/${dealId}/licenses`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!licenseResponse.ok) {
          const errorText = await licenseResponse.text()
          throw new Error(
            `Failed to fetch license details: ${licenseResponse.status} - ${errorText}`
          )
        }

        const licenseResult = await licenseResponse.json()
        if (licenseResult.success && licenseResult.data) {
          setLicenseDetails(licenseResult.data)
        } else {
          throw new Error('Invalid response format from license details API')
        }
      } catch (error: any) {
        console.error('Error fetching license details:', error)
      } finally {
        setLoadingLicenseDetails(false)
      }
    }

    if (params.dealId) {
      fetchLicenseDetails()
    }
  }, [params.dealId])

  // Fetch stripe payment on page load (for vendor tile and non-vendor Pay Now)
  useEffect(() => {
    const fetchStripePayment = async () => {
      const requestId = params.dealId as string
      if (!requestId) return
      try {
        setLoadingStripePayment(true)
        const response = await fetch(
          `/api/reseller/deals/stripe/payment/${requestId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        if (!response.ok) {
          setStripePaymentData(null)
          return
        }
        const result = await response.json()
        if (result.success && result.data) {
          setStripePaymentData(result.data)
        } else {
          setStripePaymentData(null)
        }
      } catch {
        setStripePaymentData(null)
      } finally {
        setLoadingStripePayment(false)
      }
    }
    fetchStripePayment()
  }, [params.dealId])

  // Fetch customers list on page load and when page changes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true)
        const dealId = params.dealId as string
        if (!dealId) {
          return
        }

        // Calculate page number (0-indexed for API)
        const pageNumber = currentPage - 1

        const response = await fetch(
          `/api/reseller/deals/customer/list?dealId=${dealId}&page=${pageNumber}&size=${itemsPerPage}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Failed to fetch customers: ${response.status} - ${errorText}`
          )
        }

        const result = await response.json()

        if (result.success && result.data) {
          // Map API response to Customer interface
          const mappedCustomers: Customer[] = result.data.content.map(
            (customer: any) => mapCustomerData(customer)
          )

          setCustomers(mappedCustomers)
          setTotalCustomers(result.data.totalElements || 0)
          setTotalPages(result.data.totalPages || 0)
        } else {
          throw new Error('Invalid response format from customer list API')
        }
      } catch (error: any) {
        console.error('Error fetching customers:', error)
        setCustomers([])
      } finally {
        setLoadingCustomers(false)
      }
    }

    if (params.dealId) {
      fetchCustomers()
    }
  }, [params.dealId, currentPage, itemsPerPage])

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerId: number) => {
    // Prevent multiple simultaneous deletions
    if (deletingCustomerId !== null) {
      return
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to remove this customer?')) {
      return
    }

    try {
      setDeletingCustomerId(customerId)

      const response = await fetch(
        `/api/reseller/deals/customer/${customerId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }

      const result = await response.json()

      if (result.success) {
        // Refresh customer list
        const dealId = params.dealId as string
        if (dealId) {
          const pageNumber = currentPage - 1
          const customersResponse = await fetch(
            `/api/reseller/deals/customer/list?dealId=${dealId}&page=${pageNumber}&size=${itemsPerPage}`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )

          if (customersResponse.ok) {
            const customersResult = await customersResponse.json()
            if (customersResult.success && customersResult.data) {
              const mappedCustomers: Customer[] =
                customersResult.data.content.map((customer: any) =>
                  mapCustomerData(customer)
                )

              setCustomers(mappedCustomers)
              setTotalCustomers(customersResult.data.totalElements || 0)
              setTotalPages(customersResult.data.totalPages || 0)
            }
          }

          // Refresh license details
          const licenseResponse = await fetch(
            `/api/reseller/deals/${dealId}/licenses`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )

          if (licenseResponse.ok) {
            const licenseResult = await licenseResponse.json()
            if (licenseResult.success && licenseResult.data) {
              setLicenseDetails(licenseResult.data)
            }
          }
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      showCustomToast(
        'Error',
        error.message || 'Failed to delete customer. Please try again.',
        'error'
      )
    } finally {
      setDeletingCustomerId(null)
    }
  }

  // Handle adding a new customer
  const handleAddCustomer = async () => {
    // Validate form
    if (!customerFormData.customerName || !customerFormData.email) {
      showCustomToast(
        'Validation Error',
        'Please fill in all required fields',
        'error'
      )
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerFormData.email)) {
      showCustomToast(
        'Validation Error',
        'Please enter a valid email address',
        'error'
      )
      return
    }

    const dealId = params.dealId as string
    if (!dealId) {
      showCustomToast('Error', 'Deal ID is not available', 'error')
      return
    }

    try {
      setAddingCustomer(true)

      const requestBody = {
        email: customerFormData.email,
        customerName: customerFormData.customerName,
        resellerDealId: parseInt(dealId)
      }

      const response = await fetch('/api/reseller/deals/customer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Add the new customer to the list
        const newCustomer: Customer = mapCustomerData(result.data)
        setCustomers((prev) => [newCustomer, ...prev])
        setTotalCustomers((prev) => prev + 1)

        // Reset form and close modal
        setCustomerFormData({ customerName: '', email: '' })
        setShowAddCustomerModal(false)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Error adding customer:', error)
      showCustomToast(
        'Error',
        error.message || 'Failed to add customer. Please try again.',
        'error'
      )
    } finally {
      setAddingCustomer(false)
    }
  }

  // CSV Import handlers
  const handleFileUpload = (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      showCustomToast('Validation Error', 'Please upload a CSV file', 'error')
      return
    }

    setCsvFile(file)

    // Parse CSV to extract columns
    Papa.parse(file, {
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          // Get column headers from first row
          const headers = results.data[0] as string[]
          setCsvColumns(headers)
        }
      },
      header: false,
      skipEmptyLines: true
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileUpload(droppedFile)
    }
  }

  const handleCsvFileClick = () => {
    csvFileInputRef.current?.click()
  }

  const handleCsvFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const handleImportCustomers = async () => {
    if (!csvFile) {
      showCustomToast(
        'Validation Error',
        'Please upload a CSV file first',
        'error'
      )
      return
    }

    // Validate mapping
    if (!selectedMapping['Customer name'] || !selectedMapping['Email']) {
      showCustomToast(
        'Validation Error',
        'Please map all required fields (Customer name and Email)',
        'error'
      )
      return
    }

    const dealId = params.dealId as string
    if (!dealId) {
      showCustomToast('Error', 'Deal ID is not available', 'error')
      return
    }

    try {
      setImportingCustomers(true)

      // Parse CSV data to get rows (skipping header row)
      Papa.parse(csvFile, {
        complete: async (results: any) => {
          const rows = results.data.slice(1) // Skip header row

          // Get column indices from selectedMapping
          const customerNameColumn = csvColumns.indexOf(
            selectedMapping['Customer name']
          )
          const emailColumn = csvColumns.indexOf(selectedMapping['Email'])

          if (customerNameColumn === -1 || emailColumn === -1) {
            showCustomToast(
              'Validation Error',
              'Invalid column mapping. Please check your mapping.',
              'error'
            )
            setImportingCustomers(false)
            return
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

          // Process each row and add customers
          const importPromises = rows
            .filter((row: any) => {
              // Filter out empty rows
              return (
                row[customerNameColumn] &&
                row[emailColumn] &&
                row[customerNameColumn].trim() !== '' &&
                row[emailColumn].trim() !== ''
              )
            })
            .map(async (row: any) => {
              const customerName = row[customerNameColumn]?.trim()
              const email = row[emailColumn]?.trim()

              // Validate email format
              if (!emailRegex.test(email)) {
                console.warn(`Invalid email format: ${email}`)
                return null
              }

              const requestBody = {
                email: email,
                customerName: customerName,
                resellerDealId: parseInt(dealId)
              }

              try {
                const response = await fetch(
                  '/api/reseller/deals/customer/add',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                  }
                )

                if (!response.ok) {
                  const errorData = await response.json()
                  console.error(
                    `Failed to add customer ${customerName}:`,
                    errorData.message || response.statusText
                  )
                  return null
                }

                const result = await response.json()
                if (result.success && result.data) {
                  return mapCustomerData(result.data)
                }
                return null
              } catch (error: any) {
                console.error(`Error adding customer ${customerName}:`, error)
                return null
              }
            })

          // Wait for all imports to complete
          const importedCustomers = await Promise.all(importPromises)
          const successfulImports = importedCustomers.filter(
            (customer) => customer !== null
          ) as Customer[]

          if (successfulImports.length > 0) {
            // Refresh customer list
            const pageNumber = currentPage - 1
            const customersResponse = await fetch(
              `/api/reseller/deals/customer/list?dealId=${dealId}&page=${pageNumber}&size=${itemsPerPage}`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (customersResponse.ok) {
              const customersResult = await customersResponse.json()
              if (customersResult.success && customersResult.data) {
                const mappedCustomers: Customer[] =
                  customersResult.data.content.map((customer: any) =>
                    mapCustomerData(customer)
                  )

                setCustomers(mappedCustomers)
                setTotalCustomers(customersResult.data.totalElements || 0)
                setTotalPages(customersResult.data.totalPages || 0)
              }
            }

            // Refresh license details
            const licenseResponse = await fetch(
              `/api/reseller/deals/${dealId}/licenses`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (licenseResponse.ok) {
              const licenseResult = await licenseResponse.json()
              if (licenseResult.success && licenseResult.data) {
                setLicenseDetails(licenseResult.data)
              }
            }

            showCustomToast(
              'Success',
              `Successfully imported ${successfulImports.length} customer(s).`,
              'success'
            )
          } else {
            showCustomToast(
              'Warning',
              'No customers were imported. Please check your CSV file and try again.',
              'info'
            )
          }

          // Reset state
          setCsvFile(null)
          setCsvColumns([])
          setSelectedMapping({
            'Customer name': '',
            Email: ''
          })
          setShowImportCustomerModal(false)
        },
        header: false,
        skipEmptyLines: true
      })
    } catch (error: any) {
      console.error('Error importing customers:', error)
      showCustomToast(
        'Error',
        error.message || 'Failed to import customers. Please try again.',
        'error'
      )
    } finally {
      setImportingCustomers(false)
    }
  }

  // Fetch partners and countries
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/active-partners')
        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }
        const data = await response.json()
        setPartners(data)
      } catch (error) {
        console.error('Error fetching partners:', error)
      }
    }

    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchPartners()
    fetchCountries()
  }, [])

  const handleApprove = async () => {
    try {
      setSubmitting(true)

      // First, approve the deal in the system
      if (!deal?.dealId) {
        showCustomToast(
          'Error',
          'Deal data is not available. Please refresh the page.',
          'error'
        )
        return
      }

      // Validate that we have a valid integration type
      if (!selectedCRM) {
        showCustomToast(
          'Validation Error',
          'Please select a CRM integration before approving the deal.',
          'error'
        )
        return
      }

      const requestBody = {
        dealId: deal.dealId,
        isApproved: true,
        dealProtectionPeriod: dealProtectionPeriod,
        integrationType: selectedCRM
      }

      const approveResponse = await fetch(
        `/api/my-deals/approve/${deal.dealId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!approveResponse.ok) {
        const errorText = await approveResponse.text()
        throw new Error(
          `Failed to approve deal: ${approveResponse.status} - ${errorText}`
        )
      }

      const result = await approveResponse.json()
      if (result) {
        router.push('/deal-pipeline')
        return
      }
      // Then, create HubSpot deal using the stored hubspotApp data
      // if (!hubspotApp) {
      //   alert('HubSpot integration not found. Please connect HubSpot first.')
      //   return
      // }

      // if (!hubspotApp.refreshToken) {
      //   alert('HubSpot refresh token not found. Please reconnect HubSpot.')
      //   return
      // }

      // Generate access token from refresh token using API route to avoid CORS
      const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
      const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL

      const payloadData = {
        grant_type: 'refresh_token',
        client_id: client_id as string,
        client_secret: clientSecret as string,
        redirect_uri: redirectUri as string,
        refresh_token: hubspotApp.refreshToken as string
      }

      const response = await fetch('/api/hubapi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payloadData).toString()
      })

      const tokenResponse = await response.json()

      if (tokenResponse && tokenResponse.access_token) {
        // Now create the HubSpot deal using the access token
        // const dealProperties = {
        //   dealname: `${deal?.customerAccountName}`,
        //   dealstage: 'appointmentscheduled',
        //   pipeline: 'default',
        //   amount: deal?.estimatedAcv?.toString() || '0',
        //   dealtype: 'newbusiness'
        // }

        router.push('/deal-pipeline')

        const createDealResponse = await fetch('/api/create-hubspot-deal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bearerToken: tokenResponse.access_token
            // properties: dealProperties
          })
        })

        // const createDealResult = await createDealResponse.json()

        // if (createDealResult.success) {
        //   // Redirect to deal pipeline
        //   router.push('/deal-pipeline')
        // } else {
        //   alert('Failed to create deal in HubSpot. Check console for details.')
        //   // Still redirect even if HubSpot creation fails since deal is approved
        //   router.push('/deal-pipeline')
        // }
      } else {
        showCustomToast(
          'Error',
          'Failed to generate HubSpot access token. Please check the console for details.',
          'error'
        )
        // Still redirect even if HubSpot creation fails since deal is approved
        router.push('/deal-pipeline')
      }
    } catch (error) {
      showCustomToast(
        'Error',
        'An error occurred while processing the approval. Check console for details.',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeny = async () => {
    try {
      setSubmitting(true)
      if (!isHubSpotConnected) {
        setShowModal(true)
        return
      }
      if (!deal?.dealId) {
        showCustomToast(
          'Error',
          'Deal data is not available. Please refresh the page.',
          'error'
        )
        return
      }

      const requestBody = {
        dealId: deal.dealId,
        isApproved: false,
        dealProtectionPeriod: dealProtectionPeriod
      }

      const response = await fetch(`/api/my-deals/approve/${deal.dealId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to deny deal: ${response.status} - ${errorText}`
        )
      }

      const result = await response.json()

      // Redirect to deal pipeline
      router.push('/deal-pipeline')
    } catch (error) {
      showCustomToast('Error', 'Failed to deny deal', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResellerDealApprove = async () => {
    try {
      setIsApproving(true)

      const dealId = params.dealId as string
      if (!dealId) {
        showCustomToast(
          'Error',
          'Deal ID is not available. Please refresh the page.',
          'error'
        )
        return
      }

      // Validate that we have a valid integration type
      if (!selectedCRM) {
        showCustomToast(
          'Validation Error',
          'Please select a CRM integration before approving the deal.',
          'error'
        )
        return
      }

      // Make PATCH request with query parameters
      const url = `/api/reseller/deals/approve/${dealId}?integrationType=${selectedCRM}&isApproved=true`
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to approve deal: ${response.status} - ${errorText}`
        )
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Update the reseller deal details with the response data
        setResellerDealDetails(result.data)
        showCustomToast('Success', 'Deal approved successfully!', 'success')
        // Optionally refresh the page or update UI
        window.location.reload()
      } else {
        throw new Error(result.message || 'Failed to approve deal')
      }
    } catch (error: any) {
      console.error('Error approving deal:', error)
      showCustomToast(
        'Error',
        error.message || 'Failed to approve deal. Please try again.',
        'error'
      )
    } finally {
      setIsApproving(false)
    }
  }

  const handleGeneratePaymentLink = async () => {
    const dealId = params.dealId as string
    if (!dealId || !resellerDealDetails) {
      showCustomToast(
        'Error',
        'Deal or reseller details not available. Please refresh the page.',
        'error'
      )
      return
    }
    try {
      setGeneratingPaymentLink(true)
      // Fetch reseller organization by resellerOrgId to get primaryEmail (same as https://dev.sharkdomapi.com/organization/id?id=resellerOrgId)
      const orgRes = await fetch(
        `/api/organization/id?id=${resellerDealDetails.resellerOrgId}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!orgRes.ok) {
        throw new Error('Failed to fetch reseller organization')
      }
      // Response shape from GET https://dev.sharkdomapi.com/organization/id?id={resellerOrgId}
      const resellerOrg = (await orgRes.json()) as {
        id?: number
        primaryEmail?: string
        currency?: string
        name?: string
        [key: string]: unknown
      }
      const customerEmail = resellerOrg?.primaryEmail
      if (!customerEmail) {
        showCustomToast(
          'Error',
          'Reseller organization primary email not found.',
          'error'
        )
        setGeneratingPaymentLink(false)
        return
      }
      // API returns currency as "INR"; Stripe expects lowercase e.g. "inr"
      const currency = (
        resellerOrg?.currency ??
        organization?.currency ??
        'INR'
      ).toLowerCase()
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : ''
      const payload = {
        customerEmail,
        productName: `${resellerDealDetails?.partnerName}X${organization?.organizationName ?? resellerOrg?.name ?? ''}`,
        unitAmount: resellerDealDetails.buyPrice,
        currency: organization?.currency,
        quantity: 1,
        successUrl: `${baseUrl}/deal-pipeline/resell/${dealId}`,
        cancelUrl: `${baseUrl}/settings/subscription-billing/payment-failure?dealId=${dealId}&returnUrl=${encodeURIComponent(`deal-pipeline/resell/${dealId}`)}`,
        resellerId: resellerDealDetails.resellerOrgId,
        dealRequestedId: Number(dealId)
      }
      const response = await fetch(
        '/api/reseller/deals/stripe/payment/link/generation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/hal+json'
          },
          body: JSON.stringify(payload)
        }
      )
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(
          errData.message || `HTTP error! status: ${response.status}`
        )
      }
      const result = await response.json()
      if (result.success && result.data) {
        setStripePaymentData((prev) =>
          prev
            ? { ...prev, checkoutUrl: result.data, paymentStatus: 'PENDING' }
            : {
                id: 0,
                resellerId: resellerDealDetails.resellerOrgId,
                requestId: parseInt(dealId, 10),
                vendorOrgId: resellerDealDetails.vendorOrgId,
                checkoutUrl: result.data,
                paymentStatus: 'PENDING',
                amount: resellerDealDetails.actualPrice ?? 0,
                customerEmail: payload.customerEmail
              }
        )
        showCustomToast(
          'Success',
          'Payment link generated successfully.',
          'success'
        )
      } else {
        throw new Error(result.message || 'Failed to generate payment link')
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate payment link'
      showCustomToast('Error', message, 'error')
    } finally {
      setGeneratingPaymentLink(false)
    }
  }

  const fetchHistory = async (hubSpotDealId: string) => {
    try {
      setLoadingHistory(true)
      console.log('fetch deal called')
      const response = await fetch(
        `/api//my-deals/${hubSpotDealId}/history?isVendor=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data = await response.json()
      console.log('fetchHistory', data)
      setHistory(data)
      setIsHistoryDrawerOpen(true)
    } catch (error) {
      console.error('Error fetching deals:', error)
      setError('Failed to load deals')
    } finally {
      setLoadingHistory(false)
    }
  }

  const LoadingSkeleton = () => (
    <div className='relative min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-4 pb-12 pt-8 md:px-[10%]'>
          <Link
            href='/deal-pipeline/resell'
            className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
          >
            <ArrowLeft size={18} /> Back to Deal Pipeline
          </Link>
          <div className='mb-2 text-xl font-bold text-[#1A202C] md:text-2xl'>
            Deal Details
          </div>
          <div className='mb-6 text-sm text-[#6B7280] md:text-base'>
            Review deal registration details
          </div>

          <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
            {/* Left: Form skeleton */}
            <div className='w-full flex-1 md:min-w-[340px]'>
              <div className='mb-6 rounded-2xl border bg-white p-4 md:p-8'>
                <div className='mb-6 flex items-center gap-2'>
                  <FileText size={20} className='text-gray-800' />
                  <span className='text-base font-semibold text-[#1A202C] md:text-lg'>
                    Opportunity Details
                  </span>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={i > 6 ? 'md:col-span-2' : ''}>
                      <div className='mb-1 h-3 w-24 animate-pulse rounded bg-gray-200'></div>
                      <div className='h-10 animate-pulse rounded-lg bg-gray-200'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar skeleton */}
            <div className='mt-6 flex w-full flex-col gap-4 md:mt-0 md:max-w-xs md:gap-6'>
              {[1].map((i) => (
                <div key={i} className='rounded-2xl border bg-white p-4 md:p-6'>
                  <div className='mb-4 h-6 w-32 animate-pulse rounded bg-gray-200'></div>
                  <div className='space-y-2'>
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className='flex justify-between'>
                        <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
                        <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[#FAFBFC]'>
        <div className='flex w-full flex-col items-center'>
          <div className='flex w-full flex-col gap-0 px-4 pb-12 pt-8 md:px-[10%]'>
            <Link
              href='/deal-pipeline/resell'
              className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
            >
              <ArrowLeft size={18} /> Back to Deal Pipeline
            </Link>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!deal || !resellerDealDetails) {
    return <LoadingSkeleton />
  }
  return (
    <div className='min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-4 pb-12 pt-8 md:px-[10%]'>
          <div className='flex w-full flex-col gap-0'>
            <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
              {/* Content on the left */}
              <div className='flex-1'>
                {/* Add any additional content here, if needed */}
                <Link
                  href='/deal-pipeline/resell'
                  className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
                >
                  <ArrowLeft size={18} /> Back to Deal Pipeline
                </Link>

                <div className='mb-2 flex items-center gap-3'>
                  <h1 className='text-xl font-bold text-[#1A202C] md:text-2xl'>
                    {resellerDealDetails?.partnerName
                      ? `${resellerDealDetails.partnerName} Deal`
                      : 'Deal Details'}
                  </h1>
                  {resellerDealDetails?.resellerDealStatus === 'ACTIVE' && (
                    <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'>
                      {resellerDealDetails.resellerDealStatus}
                    </span>
                  )}
                </div>

                <div className='mb-6 text-sm text-[#6B7280] md:text-base'>
                  The details of the deal is displayed.
                </div>

                {/* Info Alert */}
                {resellerDealDetails?.resellerDealStag === 'REQUESTED' && (
                  <div className='mb-6 flex items-start gap-3 rounded-lg bg-blue-50 p-4'>
                    <Info size={20} className='mt-0.5 text-blue-600' />
                    <div className='flex-1'>
                      <p className='text-sm text-[#1A202C]'>
                        Your deal is submitted, please wait while your partner
                        responds. It typically takes upto 48 hours, if the
                        partner is not responding we will send another
                        notification.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className='w-full'
                >
                  <div className='mb-6'>
                    <TabsList className='flex items-start justify-start rounded-none border-b bg-white p-0'>
                      <TabsTrigger
                        value='opportunity-details'
                        className='relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-[#6B7280] data-[state=active]:border-primary-blue data-[state=active]:text-primary-blue'
                      >
                        <FileText size={16} className='mr-2' />
                        Opportunity Details
                      </TabsTrigger>
                      {showLicenseAllocationTab && (
                        <TabsTrigger
                          value='license-allocation'
                          className='relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-[#6B7280] data-[state=active]:border-primary-blue data-[state=active]:text-primary-blue'
                        >
                          <Users size={16} className='mr-2' />
                          License Allocation
                        </TabsTrigger>
                      )}
                      {/* <TabsTrigger
                        value='conflicts'
                        className='relative rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-[#6B7280] data-[state=active]:border-primary-blue data-[state=active]:text-primary-blue'
                      >
                        <Shield size={16} className='mr-2' />
                        Conflicts
                      </TabsTrigger> */}
                    </TabsList>
                  </div>

                  <TabsContent value='opportunity-details' className='mt-0'>
                    <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
                      <div className='w-full flex-1 md:min-w-[340px]'>
                        <div className='mb-6 rounded-2xl border bg-white p-4 md:p-8'>
                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {/* Resell Deal Fields - This page is only for resell deals */}
                            <>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Deal Type
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black'>
                                  Re-Selling
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Partner Name
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.partnerName || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Reseller Mode
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.resellerMode || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Expected Release Time
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.expectedReleaseTime
                                    ? `${resellerDealDetails.expectedReleaseTime} hours`
                                    : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Expected Release Date
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.expectedReleaseDate
                                    ? new Date(
                                        resellerDealDetails.expectedReleaseDate
                                      ).toLocaleDateString('en-IN')
                                    : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Products/Plan Required
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.productPlanRequired ||
                                    'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Number of Licenses
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.numberOfLicences ||
                                    'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Calculated Partner Tier
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.calculatedPartnerTier ||
                                    'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Billing Model
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.billingModel ===
                                  'prepaid-bulk'
                                    ? 'Prepaid Bulk'
                                    : resellerDealDetails?.billingModel ===
                                        'pay-per-customer'
                                      ? 'Pay-per-customer'
                                      : resellerDealDetails?.billingModel ||
                                        'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Actual Price
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.actualPrice
                                    ? `₹${resellerDealDetails.actualPrice.toLocaleString('en-IN')}`
                                    : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Buy Price (After discount)
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.buyPrice
                                    ? `₹${resellerDealDetails.buyPrice.toLocaleString('en-IN')}`
                                    : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Point of Contact (POC)
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.poc || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Deal Status
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.resellerDealStatus ||
                                    'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Deal Stage
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.resellerDealStag ||
                                    'N/A'}
                                </div>
                              </div>
                              <div>
                                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                                  Deal Source
                                </label>
                                <div className='flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                                  {resellerDealDetails?.resellerDealSource ||
                                    'N/A'}
                                </div>
                              </div>
                            </>

                            {/* Custom Fields */}
                            {deal?.customFieldsMap &&
                              Object.entries(deal.customFieldsMap).map(
                                ([fieldName, fieldData]) => (
                                  <div
                                    key={fieldName}
                                    className='md:col-span-2'
                                  >
                                    <div className='mb-1 flex items-center justify-between'>
                                      <label className='block text-xs font-medium text-[#6B7280]'>
                                        {fieldName}
                                      </label>
                                    </div>
                                    <Input
                                      value={String(fieldData?.value || 'N/A')}
                                      className='rounded-lg bg-gray-50'
                                      readOnly
                                    />
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {showLicenseAllocationTab && (
                    <TabsContent value='license-allocation' className='mt-0'>
                      <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
                        <div className='w-full flex-1'>
                          <div className='mb-6 rounded-2xl border bg-white p-4 md:p-8'>
                            {/* Search and Action Buttons */}
                            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                              <div className='relative flex-1'>
                                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                                <Input
                                  placeholder='Search for Customers'
                                  value={searchQuery}
                                  onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                  }}
                                  className='w-full rounded-lg pl-10'
                                />
                              </div>
                              <div className='flex gap-2'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant='outline'
                                      className='rounded-lg border-gray-300'
                                    >
                                      <Filter size={16} className='mr-2' />
                                      Filters
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setLicenseStatusFilter('all')
                                      }
                                    >
                                      All Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setLicenseStatusFilter('Assigned')
                                      }
                                    >
                                      Assigned
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setLicenseStatusFilter('Not Assigned')
                                      }
                                    >
                                      Not Assigned
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog
                                  open={showAddCustomerModal}
                                  onOpenChange={setShowAddCustomerModal}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant='primary'
                                      className='rounded-lg'
                                    >
                                      <Plus size={16} className='mr-2' />
                                      Add Customers
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className='max-w-md'>
                                    <DialogHeader>
                                      <DialogTitle>Add Customer</DialogTitle>
                                      <DialogDescription>
                                        Add a new customer to allocate licenses.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4 py-4'>
                                      <div>
                                        <label className='mb-1 block text-sm font-medium text-[#6B7280]'>
                                          Customer Name
                                          <span className='text-red-500'>
                                            *
                                          </span>
                                        </label>
                                        <Input
                                          placeholder='Enter customer name'
                                          value={customerFormData.customerName}
                                          onChange={(e) =>
                                            setCustomerFormData((prev) => ({
                                              ...prev,
                                              customerName: e.target.value
                                            }))
                                          }
                                          disabled={addingCustomer}
                                        />
                                      </div>
                                      <div>
                                        <label className='mb-1 block text-sm font-medium text-[#6B7280]'>
                                          Email
                                          <span className='text-red-500'>
                                            *
                                          </span>
                                        </label>
                                        <Input
                                          type='email'
                                          placeholder='Enter email'
                                          value={customerFormData.email}
                                          onChange={(e) =>
                                            setCustomerFormData((prev) => ({
                                              ...prev,
                                              email: e.target.value
                                            }))
                                          }
                                          disabled={addingCustomer}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant='outline'
                                        onClick={() => {
                                          setShowAddCustomerModal(false)
                                          setCustomerFormData({
                                            customerName: '',
                                            email: ''
                                          })
                                        }}
                                        disabled={addingCustomer}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleAddCustomer}
                                        disabled={addingCustomer}
                                      >
                                        {addingCustomer
                                          ? 'Adding...'
                                          : 'Add Customer'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Dialog
                                  open={showImportCustomerModal}
                                  onOpenChange={(open) => {
                                    setShowImportCustomerModal(open)
                                    if (!open) {
                                      // Reset state when dialog closes
                                      setCsvFile(null)
                                      setCsvColumns([])
                                      setSelectedMapping({
                                        'Customer name': '',
                                        Email: ''
                                      })
                                      setIsDragging(false)
                                    }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant='outline'
                                      className='rounded-lg border-gray-300'
                                    >
                                      <Upload size={16} className='mr-2' />
                                      Import Customers
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Import Customers
                                      </DialogTitle>
                                      <DialogDescription>
                                        Upload a CSV file to import multiple
                                        customers at once.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4 py-4'>
                                      {csvFile ? (
                                        <>
                                          {csvColumns.length > 0 && (
                                            <div className='flex flex-col gap-1 rounded-lg border bg-warning-50 p-4'>
                                              <h4 className='text-sm font-bold text-text-100'>
                                                Review column properties
                                              </h4>
                                              <h6 className='text-xs font-normal text-text-80'>
                                                Ensure columns from your file
                                                are mapped correctly to customer
                                                properties.
                                              </h6>
                                            </div>
                                          )}
                                          <div className='p-4'>
                                            <MapProperties
                                              headers={csvColumns}
                                              allHeaders={csvColumns}
                                              selectedMapping={selectedMapping}
                                              setSelectedMapping={(mapping) => {
                                                // Ensure only Customer name and Email fields are in the mapping
                                                setSelectedMapping({
                                                  'Customer name':
                                                    mapping['Customer name'] ||
                                                    '',
                                                  Email: mapping['Email'] || ''
                                                })
                                              }}
                                              isSearchEnabledDropdown={true}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <Input
                                            type='file'
                                            ref={csvFileInputRef}
                                            className='hidden'
                                            accept='.csv'
                                            onChange={handleCsvFileInputChange}
                                          />
                                          <div
                                            onClick={handleCsvFileClick}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-light-blue transition-colors ${
                                              isDragging
                                                ? 'bg-[#E5EFFE]'
                                                : 'bg-[#F8FAFF]'
                                            }`}
                                          >
                                            <Image
                                              src='/upload-icon.svg'
                                              alt='Upload'
                                              width={75}
                                              height={75}
                                            />
                                            <div className='text-center'>
                                              <p className='text-sm font-bold text-primary-blue'>
                                                Select a CSV file to upload
                                              </p>
                                              <p className='text-xs text-text-60'>
                                                or drag & drop it here
                                              </p>
                                            </div>
                                          </div>
                                          {/* Steps */}
                                          <div className='flex flex-col rounded-lg border border-text-40 text-xs'>
                                            <div className='flex items-center gap-2 border-b border-text-40 p-4 text-text-60'>
                                              <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                                                1
                                              </span>
                                              <span>
                                                Upload .csv file that contains
                                                customer details
                                              </span>
                                            </div>
                                            <div className='flex items-center gap-2 border-b border-text-40 p-4 text-text-60'>
                                              <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                                                2
                                              </span>
                                              <span>
                                                Review matched columns
                                              </span>
                                            </div>
                                            <div className='flex items-center gap-2 p-4 text-text-60'>
                                              <span className='flex items-center justify-center rounded-full text-xs text-text-60'>
                                                3
                                              </span>
                                              <span>
                                                Import all customers in one go
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant='outline'
                                        onClick={() => {
                                          setShowImportCustomerModal(false)
                                          setCsvFile(null)
                                          setCsvColumns([])
                                          setSelectedMapping({
                                            'Customer name': '',
                                            Email: ''
                                          })
                                          setIsDragging(false)
                                        }}
                                        disabled={importingCustomers}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleImportCustomers}
                                        disabled={
                                          !csvFile ||
                                          Object.values(selectedMapping).some(
                                            (value) => value === ''
                                          ) ||
                                          importingCustomers
                                        }
                                      >
                                        {importingCustomers
                                          ? 'Importing...'
                                          : 'Import Customers'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>

                            {/* License Status Filter */}
                            {licenseStatusFilter !== 'all' && (
                              <div className='mb-4 flex items-center gap-2'>
                                <span className='text-sm text-gray-600'>
                                  Filtered by:
                                </span>
                                <span className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
                                  {licenseStatusFilter === 'Assigned'
                                    ? 'Assigned'
                                    : 'Not Assigned'}
                                  <button
                                    onClick={() =>
                                      setLicenseStatusFilter('all')
                                    }
                                    className='ml-2 text-blue-600 hover:text-blue-800'
                                  >
                                    <XIcon size={14} />
                                  </button>
                                </span>
                              </div>
                            )}

                            {/* Table */}
                            <div className='overflow-x-auto'>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Expiry</TableHead>
                                    <TableHead>License Status</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                    <TableHead></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {loadingCustomers ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className='py-8 text-center text-gray-500'
                                      >
                                        Loading customers...
                                      </TableCell>
                                    </TableRow>
                                  ) : currentLicenseData.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className='py-8 text-center text-gray-500'
                                      >
                                        No customers found. Add a customer to
                                        get started.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    currentLicenseData.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell className='font-medium'>
                                          {item.customer}
                                        </TableCell>
                                        <TableCell>{item.expiry}</TableCell>
                                        <TableCell>
                                          <span
                                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                              item.status === 'Assigned'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                          >
                                            {item.status}
                                          </span>
                                        </TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>
                                          {item.status === 'Not Assigned' ? (
                                            <Button
                                              size='sm'
                                              variant='outline'
                                              className='rounded-lg border-primary-blue text-primary-blue hover:bg-blue-50'
                                              onClick={() =>
                                                setAssignLicenseModal({
                                                  open: true,
                                                  email: item.email,
                                                  customerName: item.customer,
                                                  customerId: item.id
                                                })
                                              }
                                            >
                                              Allocate
                                            </Button>
                                          ) : (
                                            <Button
                                              size='sm'
                                              variant='outline'
                                              className='rounded-lg border-green-600 text-green-600 hover:bg-green-50'
                                            >
                                              Renew
                                            </Button>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant='ghost'
                                                size='sm'
                                                className='h-8 w-8 p-0'
                                              >
                                                <MoreVertical size={16} />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                              <DropdownMenuItem
                                                className='text-red-600'
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  if (
                                                    deletingCustomerId !==
                                                    item.id
                                                  ) {
                                                    handleDeleteCustomer(
                                                      item.id
                                                    )
                                                  }
                                                }}
                                                disabled={
                                                  deletingCustomerId === item.id
                                                }
                                              >
                                                {deletingCustomerId === item.id
                                                  ? 'Removing...'
                                                  : 'Remove'}
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Pagination */}
                            <div className='mt-6 flex items-center justify-between'>
                              <div className='text-sm text-gray-600'>
                                {loadingCustomers ? (
                                  'Loading...'
                                ) : (
                                  <>
                                    Showing {startIndex + 1}-
                                    {Math.min(
                                      endIndex,
                                      searchQuery ||
                                        licenseStatusFilter !== 'all'
                                        ? filteredLicenseData.length
                                        : totalCustomers
                                    )}{' '}
                                    of{' '}
                                    {searchQuery ||
                                    licenseStatusFilter !== 'all'
                                      ? filteredLicenseData.length
                                      : totalCustomers}
                                  </>
                                )}
                              </div>
                              <div className='flex items-center gap-2'>
                                <Select
                                  value={currentPage.toString()}
                                  onValueChange={(value) =>
                                    setCurrentPage(parseInt(value))
                                  }
                                  disabled={loadingCustomers}
                                >
                                  <SelectTrigger className='h-9 w-20'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from(
                                      { length: displayTotalPages || 1 },
                                      (_, i) => (
                                        <SelectItem
                                          key={i + 1}
                                          value={(i + 1).toString()}
                                        >
                                          {String(i + 1).padStart(2, '0')}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <span className='text-sm text-gray-600'>
                                  of {displayTotalPages || 1} pages
                                </span>
                                <div className='flex gap-1'>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={
                                      currentPage === 1 || loadingCustomers
                                    }
                                    className='h-9 w-9 p-0'
                                  >
                                    <ChevronLeft size={16} />
                                  </Button>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(
                                          prev + 1,
                                          displayTotalPages || 1
                                        )
                                      )
                                    }
                                    disabled={
                                      currentPage ===
                                        (displayTotalPages || 1) ||
                                      loadingCustomers
                                    }
                                    className='h-9 w-9 p-0'
                                  >
                                    <ChevronRight size={16} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value='conflicts' className='mt-0'>
                    <div className='rounded-2xl border bg-white p-8'>
                      {conflicts.length > 0 ? (
                        <div className='space-y-4'>
                          {conflicts.map((conflict) => {
                            const isDismissed = dismissedConflicts.has(
                              conflict.id
                            )
                            if (isDismissed) return null

                            return (
                              <div
                                key={conflict.id}
                                className='rounded-lg border border-gray-200 p-4'
                              >
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-3'>
                                    <ChevronRightIcon
                                      size={16}
                                      className='text-gray-400'
                                    />
                                    <div>
                                      <span className='font-medium text-[#1A202C]'>
                                        {conflict.title}
                                      </span>
                                      {conflict.count > 0 && (
                                        <span className='ml-2 text-sm text-gray-500'>
                                          ({conflict.count} Conflict
                                          {conflict.count > 1 ? 's' : ''})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDismissConflict(conflict.id)
                                    }
                                    className='ml-2 rounded p-1 hover:bg-gray-100'
                                    aria-label='Dismiss conflict'
                                  >
                                    <XIcon
                                      size={16}
                                      className='text-gray-400'
                                    />
                                  </button>
                                </div>
                                {conflict.details && (
                                  <div className='mt-4 rounded-lg bg-gray-50 p-4'>
                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                      <div>
                                        <span className='text-gray-500'>
                                          Account Name:
                                        </span>
                                        <p className='font-medium text-[#1A202C]'>
                                          {conflict.details.accountName}
                                        </p>
                                      </div>
                                      <div>
                                        <span className='text-gray-500'>
                                          Owner:
                                        </span>
                                        <p className='font-medium text-[#1A202C]'>
                                          {conflict.details.owner}
                                        </p>
                                      </div>
                                      <div>
                                        <span className='text-gray-500'>
                                          Stage:
                                        </span>
                                        <p>
                                          <span className='inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                                            {conflict.details.stage}
                                          </span>
                                        </p>
                                      </div>
                                      <div>
                                        <span className='text-gray-500'>
                                          Last Activity:
                                        </span>
                                        <p className='font-medium text-[#1A202C]'>
                                          {conflict.details.lastActivity}
                                        </p>
                                      </div>
                                      <div className='col-span-2'>
                                        <span className='text-gray-500'>
                                          Region:
                                        </span>
                                        <p className='font-medium text-[#1A202C]'>
                                          {conflict.details.region}
                                        </p>
                                      </div>
                                    </div>
                                    {conflict.id === 'account-exists' && (
                                      <div className='mt-4 flex items-center justify-between rounded-lg bg-green-50 p-3'>
                                        <p className='text-sm text-gray-600'>
                                          Linked to CRM
                                        </p>
                                        <Check
                                          size={16}
                                          className='text-green-600'
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {conflict.resolutionText && (
                                  <div className='mt-4'>
                                    <p className='mb-2 text-sm font-medium text-[#1A202C]'>
                                      How to resolve?
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                      {conflict.resolutionText}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className='flex flex-col items-center justify-center py-12 text-center'>
                          <Shield size={48} className='mb-4 text-gray-400' />
                          <p className='text-lg font-medium text-gray-600'>
                            No conflicts found for this deal.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar - Always visible with Licenses Details, Connect CRM only in Opportunity Details */}
              <div className='mt-6 flex w-full flex-col gap-4 md:mt-0 md:max-w-xs md:gap-6'>
                {/* Licenses Details - Always visible */}
                <LicensesDetailsCard
                  licensesPurchased={licenseDetails?.licensesPurchased || 0}
                  licensesAllocated={licenseDetails?.licensesAllocated || 0}
                  licensesRemaining={licenseDetails?.licensesRemaining || 0}
                  licensesConsumed={licenseDetails?.licensesConsumed || 0}
                  dealId={(params.dealId as string) || deal?.dealId}
                />

                {/* Connect Your CRM - Only in Opportunity Details tab and only for vendors */}
                {activeTab === 'opportunity-details' && isVendor && (
                  <div className='rounded-2xl border bg-white p-4 md:p-6'>
                    <div className='mb-4 text-base font-semibold text-[#1A202C] md:text-lg'>
                      Connect Your CRM
                    </div>
                    {connectedApps.length > 0 ? (
                      <div className='mb-4 flex flex-col'>
                        <label className='mb-1 text-xs font-medium text-[#6B7280]'>
                          Connected CRM
                        </label>
                        <Select
                          value={selectedCRM}
                          onValueChange={setSelectedCRM}
                        >
                          <SelectTrigger className='h-9 w-full rounded-lg border-gray-300'>
                            <SelectValue placeholder='Select CRM'>
                              {selectedCRM
                                ? formatCRMName(selectedCRM)
                                : 'Select CRM'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {connectedApps
                              .filter((appType) => appType !== 'G_CALENDAR')
                              .map((appType) => (
                                <SelectItem key={appType} value={appType}>
                                  {formatCRMName(appType)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <div className='mb-4 flex items-center justify-center rounded-lg bg-gray-50 p-8'>
                          <div className='flex flex-col items-center gap-2 text-center'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                              <FileText size={24} className='text-gray-400' />
                            </div>
                          </div>
                        </div>
                        <p className='mb-4 text-sm text-[#6B7280]'>
                          To see the lapse of the opportunities or account or
                          customers this will help.{' '}
                          <Link
                            href='#'
                            className='text-primary-blue hover:underline'
                          >
                            Learn more
                          </Link>
                          .
                        </p>
                        <Button
                          variant='primary'
                          className='w-full rounded-lg font-semibold'
                          onClick={() => router.push('/integrations')}
                        >
                          Connect CRM
                        </Button>
                      </>
                    )}

                    {/* Approve Button */}
                    {connectedApps.length > 0 &&
                      resellerDealDetails?.resellerDealStag !== 'APPROVED' && (
                        <div className='mt-4'>
                          {!selectedCRM ? (
                            <div className='mb-2 rounded-lg bg-yellow-50 p-3'>
                              <p className='text-xs text-yellow-800'>
                                Please select a CRM to enable the approve
                                button.
                              </p>
                            </div>
                          ) : null}
                          <Button
                            variant={
                              !selectedCRM || isApproving
                                ? 'disable'
                                : 'primary'
                            }
                            className={cn(
                              'w-full rounded-lg font-semibold',
                              (!selectedCRM || isApproving) &&
                                'disabled:pointer-events-auto disabled:cursor-not-allowed'
                            )}
                            onClick={handleResellerDealApprove}
                            disabled={!selectedCRM || isApproving}
                            loading={isApproving}
                            loadingText='Approving...'
                          >
                            Approve Deal
                          </Button>
                        </div>
                      )}
                    {resellerDealDetails?.resellerDealStag === 'APPROVED' && (
                      <div className='mt-4 rounded-lg bg-green-50 p-3'>
                        <p className='text-xs font-medium text-green-800'>
                          ✓ Deal has been approved
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stripe Payment - Only for vendors */}
                {activeTab === 'opportunity-details' && isVendor && (
                  <div className='rounded-2xl border bg-white p-4 md:p-6'>
                    <div className='mb-4 text-base font-semibold text-[#1A202C] md:text-lg'>
                      Stripe Payment
                    </div>
                    {loadingStripePayment ? (
                      <div className='flex items-center justify-center py-8'>
                        <Loader
                          size={24}
                          className='animate-spin text-primary-blue'
                        />
                      </div>
                    ) : connectedApps.includes('STRIPE') ? (
                      stripePaymentData?.checkoutUrl ? (
                        <>
                          <div className='mb-4 rounded-lg bg-gray-50 p-4'>
                            <p className='mb-2 text-xs font-medium text-[#6B7280]'>
                              Payment link has been generated
                            </p>
                            <div className='space-y-2 text-sm'>
                              {stripePaymentData.amount != null && (
                                <div className='flex justify-between'>
                                  <span className='text-gray-500'>Amount:</span>
                                  <span className='font-medium'>
                                    ₹{stripePaymentData.amount.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {stripePaymentData.customerEmail && (
                                <div className='flex justify-between'>
                                  <span className='text-gray-500'>Email:</span>
                                  <span className='truncate'>
                                    {stripePaymentData.customerEmail}
                                  </span>
                                </div>
                              )}
                              <div className='flex justify-between'>
                                <span className='text-gray-500'>Status:</span>
                                <span className='font-medium'>
                                  {stripePaymentData.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className='text-xs text-[#6B7280]'>
                            Reseller can pay using the generated link. You
                            cannot generate a new link while this one is active.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className='mb-4 text-sm text-[#6B7280]'>
                            Generate a Stripe payment link for the reseller to
                            complete the vendor deal fee.
                          </p>
                          <Button
                            className='w-full rounded-lg bg-primary-blue font-semibold text-white hover:bg-blue-700'
                            onClick={handleGeneratePaymentLink}
                            loading={generatingPaymentLink}
                            loadingText='Generating...'
                            disabled={generatingPaymentLink}
                          >
                            Generate Payment Link
                          </Button>
                        </>
                      )
                    ) : (
                      <>
                        <div className='mb-4 flex items-center justify-center rounded-lg bg-gray-50 p-8'>
                          <div className='flex flex-col items-center gap-2 text-center'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                              <CreditCard size={24} className='text-gray-400' />
                            </div>
                          </div>
                        </div>
                        <p className='mb-4 text-sm text-[#6B7280]'>
                          You need to connect Stripe to generate payment links
                          for resellers.
                        </p>
                        <Button
                          className='w-full rounded-lg bg-primary-blue font-semibold text-white hover:bg-blue-700'
                          onClick={() => router.push('/integrations')}
                        >
                          Connect Stripe
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Pay Now - Only for non-vendor when payment is PENDING with checkoutUrl */}
                {activeTab === 'opportunity-details' &&
                  !isVendor &&
                  stripePaymentData?.checkoutUrl &&
                  stripePaymentData?.paymentStatus === 'PENDING' && (
                    <div className='rounded-2xl border bg-white p-4 md:p-6'>
                      <div className='mb-4 text-base font-semibold text-[#1A202C] md:text-lg'>
                        Complete Payment
                      </div>
                      <p className='mb-4 text-sm text-[#6B7280]'>
                        Complete the vendor onboarding fee payment to proceed.
                      </p>
                      <Button
                        className='w-full rounded-lg bg-primary-blue font-semibold text-white hover:bg-blue-700'
                        onClick={() =>
                          window.open(stripePaymentData.checkoutUrl!, '_blank')
                        }
                      >
                        Pay Now
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && isVendor && !deal.isApproved && !checkingConnection && (
        <div
          className='fixed inset-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 transition-all'
          onClick={() => setShowModal(false)} // close when clicking overlay
        >
          <div
            className='flex w-5/12 flex-col gap-6 rounded-xl bg-white p-6'
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            {/* Modal content */}
            <div className='flex items-start gap-3'>
              <div className='mt-1'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F6FF]'>
                  <Info className='h-5 w-5 text-[#2563EB]' strokeWidth={2} />
                </div>
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-xl font-semibold text-[#0F172A]'>
                  You need to connect your CRM
                </p>
                <p className='text-sm text-[#475569]'>
                  Connect your company information to unlock insights
                </p>
              </div>
            </div>
            <p className='text-sm text-[#475569]'>
              To see your audience overlap and partnership potential with{' '}
              <span className='font-semibold'>
                {deal?.customerAccountName || 'the company'}
              </span>
              , we need some basic information about company and target
              audience.
            </p>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
              <Link href='/integrations' className='w-1/2'>
                <div className='inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3E50F7] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2c3ed9]'>
                  Connect CRM
                  <ArrowRight size={16} />
                </div>
              </Link>
              <a
                className='transitio inline-flex cursor-pointer items-center justify-center gap-2 bg-white px-5 py-2 text-sm font-semibold text-gray-700'
                href='https://help.sharkdom.com/'
                target='_blank'
              >
                Why do I need to connect CRM?
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Deal History Drawer */}
      <DealHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        historyData={history}
      />

      {/* Assign License Modal */}
      <AssignLicenseModal
        open={assignLicenseModal.open}
        onOpenChange={(open) =>
          setAssignLicenseModal((prev) => ({ ...prev, open }))
        }
        email={assignLicenseModal.email}
        customerName={assignLicenseModal.customerName}
        customerId={assignLicenseModal.customerId}
        dealId={params.dealId as string}
        onConfirm={async (allocationData) => {
          // Refresh customer list and license details after successful allocation
          try {
            const dealId = params.dealId as string
            if (!dealId) return

            // Refresh customers list
            const pageNumber = currentPage - 1
            const customersResponse = await fetch(
              `/api/reseller/deals/customer/list?dealId=${dealId}&page=${pageNumber}&size=${itemsPerPage}`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (customersResponse.ok) {
              const customersResult = await customersResponse.json()
              if (customersResult.success && customersResult.data) {
                const mappedCustomers: Customer[] =
                  customersResult.data.content.map((customer: any) => {
                    // If this is the customer that was just allocated, use allocation data
                    const isAllocatedCustomer =
                      allocationData &&
                      (customer.customerId || customer.id) ===
                        allocationData.customerId
                    if (isAllocatedCustomer && allocationData) {
                      // Override with allocation data if available
                      return {
                        id: customer.customerId || customer.id,
                        customer: customer.customerName,
                        email: customer.email,
                        status:
                          allocationData.licenseStatus === 'ASSIGNED'
                            ? 'Assigned'
                            : 'Not Assigned',
                        expiry: allocationData.expiryDate
                          ? new Date(
                              allocationData.expiryDate
                            ).toLocaleDateString('en-IN')
                          : ''
                      }
                    }
                    // Otherwise use the mapped customer data from API
                    return mapCustomerData(customer)
                  })
                setCustomers(mappedCustomers)
              }
            }

            // Refresh license details
            const licenseResponse = await fetch(
              `/api/reseller/deals/${dealId}/licenses`,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (licenseResponse.ok) {
              const licenseResult = await licenseResponse.json()
              if (licenseResult.success && licenseResult.data) {
                setLicenseDetails(licenseResult.data)
              }
            }
          } catch (error) {
            console.error(
              'Error refreshing data after license allocation:',
              error
            )
          }
        }}
      />
    </div>
  )
}
