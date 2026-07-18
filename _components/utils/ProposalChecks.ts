import { PlanID, PlanRestrictions } from '@/redux/reducers/planCode'

export function canSendProposals(
  plan: PlanID,
  currentProposalsSent: number
): boolean {
  return currentProposalsSent < PlanRestrictions[plan].maxProposalsSend
}

export function canAcceptProposals(
  plan: PlanID,
  currentProposalsAccepted: number
): boolean {
  return currentProposalsAccepted < PlanRestrictions[plan].maxProposalsAccept
}
