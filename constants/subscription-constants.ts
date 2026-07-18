import {
  ArrowLeft,
  Bell,
  Building,
  Check,
  ChevronDown,
  ChevronDown as ChevronDownIcon,
  Compass,
  Edit,
  FileText,
  HelpCircle,
  List,
  Lock,
  Minus,
  Plus,
  Search,
  Settings,
  User,
  UserCheck,
  Users
} from 'lucide-react'

// Navigation menu items
export const navigationItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    hasSubmenu: true,
    submenu: [
      { id: 'company-details', label: 'Company Details' },
      { id: 'partnership-details', label: 'Partnership Details' },
      {
        id: 'subscription-billing',
        label: 'Subscription & Billing',
        isActive: true
      }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    hasSubmenu: false
  },
  {
    id: 'team',
    label: 'TEAM',
    isHeader: true
  },
  {
    id: 'all-members',
    label: 'All Members',
    icon: Users,
    hasSubmenu: false
  },
  {
    id: 'pending-sign-in',
    label: 'Pending Sign In',
    icon: UserCheck,
    hasSubmenu: false,
    secondaryIcon: Lock
  }
]

// Subscription plans data
export const subscriptionPlans = [
  {
    id: 'starter',
    title: 'Partnership Starter',
    description: 'For partner onboarding pack',
    price: '₹0',
    period: 'per month',
    features: [
      'Partner Directory (import CSV / HubSpot import)',
      'Basic Deal Registration (manual approval flow)',
      'Partner Emails: 1:1 sends (3 templates, basic send limits)',
      'Basic IPP search (Ideal Partner profile)',
      'Best for upto 4 partners',
      'Basic Persona overlap',
      'Access to 5+ integrations'
    ],
    buttonText: 'Choose Plan →'
  },
  {
    id: 'accelerator',
    title: 'Partnership Accelerator',
    description: 'For partner onboarding and management',
    price: '₹20',
    period: 'per month',
    features: [
      'Unlimited Deal Registration',
      'Unlimited IPP search (Ideal Partner profile)',
      'Deliverability & Activity tracking',
      'Access to Account Mapping',
      'Advanced analytics & weekly reports',
      'Best for upto 10 partners',
      'Access to 15+ integrations',
      '24x7 support'
    ],
    buttonText: 'Choose Plan →'
  },
  {
    id: 'enterprise',
    title: 'Partnership Enterprise',
    description: 'Perfect for All in ONE Solution',
    price: '₹40',
    period: 'per month',
    features: [
      'Unlimited Deal Registration (AI sorting & auto -approval flow)',
      'Unlimited IPP search',
      'Access to Account Mapping & Tier creation',
      'Access to Partner-intent signals',
      'Access to predictive partner-match scoring',
      'Best for over 10 partners',
      'Access to 24+ integrations',
      'Priority 24x7 support'
    ],
    buttonText: 'Choose Plan →'
  }
]

// Summary data
export const summaryData = {
  subscriptionPlan: {
    name: 'Partnership Enterprise',
    price: '₹40',
    period: 'per month',
    users: 1,
    months: 12,
    total: '₹480.00'
  },
  additionalUsers: {
    name: 'Partnership Enterprise',
    price: '₹20',
    period: 'per month',
    users: 5,
    months: 12,
    total: '₹1200.00'
  },
  grandTotal: '₹1680.00'
}

// Colors and styling constants
export const colors = {
  sidebar: {
    background: '#F8F9FB',
    text: '#4A5568',
    textLight: '#A0AEC0',
    activeBackground: 'rgb(237, 230, 255)',
    activeText: 'rgb(102, 51, 204)'
  },
  main: {
    background: '#FFFFFF',
    text: '#4A5568',
    textDark: '#2A3241'
  },
  plan: {
    cardBackground: '#FFFFFF',
    cardShadow: '0px 4px 4px rgba(139, 139, 139, 0.15)',
    buttonBorder: 'rgb(102, 51, 204)',
    buttonText: 'rgb(102, 51, 204)',
    checkmark: '#10B981'
  },
  summary: {
    background: '#FFFFFF',
    shadow: '0px 4px 4px rgba(139, 139, 139, 0.15)',
    buttonBackground: 'rgb(102, 51, 204)',
    buttonText: '#FFFFFF'
  }
}

// Address & Contact data
export const addressContactData = {
  address: '7B - DLF Cyber Hub, Sector 24',
  city: 'Gurugram',
  zipCode: '122003',
  country: 'India',
  state: 'Haryana',
  phone: '+91 39562 04751'
}

// Subscription data for the main page
export const subscriptionData = {
  marketSegment: 'Partnership Accelerator',
  price: '$20 per month',
  lastPayment: {
    amount: '$20.00',
    date: '12 Sep 2025 | 00:00 Hrs'
  }
}

// Icons
export const icons = {
  ArrowLeft,
  ChevronDown,
  User,
  Bell,
  Users,
  FileText,
  UserCheck,
  Lock,
  Search,
  Minus,
  Plus,
  Check,
  Building,
  Edit,
  Compass,
  List,
  ChevronDownIcon,
  HelpCircle,
  Settings
}
