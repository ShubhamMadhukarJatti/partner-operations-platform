/** Normalized joint pitch row from GET (non-null only when pitch has content). */
export type JointPitchData = {
  id?: number
  orgId?: number
  partnerOrgId?: number
  pitch: string
  lastEditedBy?: string | null
  lastEditedAt?: string | null
  dealId?: string | null
}

export type JointPitchGetApiResponse = {
  success: boolean
  message: string
  data: JointPitchData
}

export type SaveJointPitchPayload = {
  partnerOrgId: number
  pitch: string
  dealId?: string | null
}

/** Returned from saveJointPitch server action so API errors serialize to the client reliably. */
export type SaveJointPitchResult =
  | { ok: true; data: JointPitchGetApiResponse }
  | { ok: false; message: string }
