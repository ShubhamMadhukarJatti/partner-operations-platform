// utils/onboardingReducer.ts
export const initialState = {
  name: '',
  websiteUrl: '',
  currentRole: '',
  marketSegment: '',
  doYouHavePartnershipTeam: true,
  partnershipTeamStrength: '',
  currentPartnersCount: '',
  goalToUseSharkdom: '',
  reagon: [], // Changed from '' to [] for multiselect
  avoidFundraisingCompany: true,
  partnershipType: '',
  roleInPartnershipFunction: '',
  currentCustomer: '',
  currentCustomerStrength: ''
}

export const onboardingReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOAD_USER_DATA':
      return {
        ...state,
        ...action.payload
      }
    case 'UPDATE_NAME':
      return {
        ...state,
        name: action.payload.name
      }
    case 'UPDATE_URL':
      return {
        ...state,
        websiteUrl: action.payload.websiteUrl
      }
    case 'UPDATE_ROLE':
      return {
        ...state,
        currentRole: action.payload
      }
    case 'UPDATE_MARKET_SEGMENT':
      return {
        ...state,
        marketSegment: action.payload
      }
    case 'UPDATE_DO_YOU_HAVE_PARTNER_SHIP_TEAM':
      return {
        ...state,
        doYouHavePartnershipTeam: action.payload
      }
    case 'UPDATE_PARTNERSHIP_TEAM_STRENGTH':
      return {
        ...state,
        partnershipTeamStrength: action.payload
      }
    case 'UPDATE_CURRENT_PARTNERS_COUNT':
      return {
        ...state,
        currentPartnersCount: action.payload
      }
    case 'UPDATE_GOAL_TO_USER_SHARKDOM':
      return {
        ...state,
        goalToUseSharkdom: action.payload
      }
    case 'UPDATE_REAGON':
      console.log(state, action.payload)
      return {
        ...state,
        reagon: action.payload
      }
    case 'UPDATE_AVOID_FUND_RAISING_COMPANY':
      return {
        ...state,
        avoidFundraisingCompany: action.payload
      }
    case 'UPDATE_PARTNERSHIP_TYPE':
      return {
        ...state,
        partnershipType: action.payload
      }
    case 'UPDATE_ROLE_IN_PARTNERSHIP':
      return {
        ...state,
        roleInPartnershipFunction: action.payload
      }
    case 'UPDATE_CURRENT_CUSTOMER':
      return {
        ...state,
        currentCustomer: action.payload
      }
    case 'UPDATE_CURRENT_CUSTOMER_STRENGTH':
      return {
        ...state,
        currentCustomerStrength: action.payload
      }
  }
}
