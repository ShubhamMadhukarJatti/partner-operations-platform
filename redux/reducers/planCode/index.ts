import { createSlice, PayloadAction } from '@reduxjs/toolkit'

enum PlanID {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ELITE = 'ELITE'
}

interface IPlanRestrictions {
  creditPlayground: number
  creditAIProposal: number
  collaborationSend: number
  collaborationAccept: number
  maxProposalsSend: number
  maxProposalsAccept: number
}

const PlanRestrictions: { [key in PlanID]: IPlanRestrictions } = {
  [PlanID.FREE]: {
    creditPlayground: 2,
    creditAIProposal: 1,
    collaborationSend: 4,
    collaborationAccept: 2,
    maxProposalsSend: 4,
    maxProposalsAccept: 2
  },
  [PlanID.STANDARD]: {
    creditPlayground: 3,
    creditAIProposal: 2,
    collaborationSend: 6,
    collaborationAccept: 3,
    maxProposalsSend: 6,
    maxProposalsAccept: 3
  },
  [PlanID.PREMIUM]: {
    creditPlayground: 7,
    creditAIProposal: 5,
    collaborationSend: 10,
    collaborationAccept: 6,
    maxProposalsSend: 10,
    maxProposalsAccept: 6
  },
  [PlanID.ELITE]: {
    creditPlayground: 9,
    creditAIProposal: 9,
    collaborationSend: 15,
    collaborationAccept: 9,
    maxProposalsSend: 15,
    maxProposalsAccept: 9
  }
}

export { PlanID, PlanRestrictions }

interface PlanState {
  planDetails: {
    planID: PlanID
    restrictions: IPlanRestrictions
  }
  creditDetails: any
}

const initialState: PlanState = {
  planDetails: {
    planID: PlanID.FREE,
    restrictions: PlanRestrictions[PlanID.FREE]
  },
  creditDetails: null
}

const planSlice = createSlice({
  name: 'planCode',
  initialState,
  reducers: {
    setPlan: (state, action: PayloadAction<PlanID>) => {
      state.planDetails = {
        planID: action.payload,
        restrictions: PlanRestrictions[action.payload]
      }
    },
    setCredits: (state, action: any) => {
      state.creditDetails = null
    }
  }
})

export const { setPlan, setCredits } = planSlice.actions
export default planSlice.reducer
