# API Organization ID Usage Analysis

This document lists all APIs used in the specified folders and identifies where `organizationId` can be extracted from the token instead of being passed explicitly.

## Legend

- ✅ **CAN BE IMPROVED**: organizationId is passed explicitly but can be extracted from token
- ⚠️ **PARTIAL**: Some parameters need orgId, but could be optimized
- ❌ **CANNOT BE IMPROVED**: organizationId is used for other organization (not current user's org)
- ✓ **ALREADY OPTIMIZED**: Already fetches orgId from token on backend

---

## 1. MY-DATA FOLDER APIs

### Persona APIs

| Endpoint                                             | Method | Current Usage                            | Status             | Notes                                                                              |
| ---------------------------------------------------- | ------ | ---------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `/persona/details`                                   | GET    | `organizationId` in query params         | ✅ CAN BE IMPROVED | Used in `fetchMyPersona()` - Line 6 of partner-match.ts                            |
| `/persona`                                           | POST   | `organizationId` in request body         | ✅ CAN BE IMPROVED | Used in `createNewPersona()` - Line 54 of partner-match.ts                         |
| `/persona/overlap`                                   | POST   | `organizationId` in request body         | ✅ CAN BE IMPROVED | Used in `createNewPersonaOverlap()` - Line 66 of partner-match.ts                  |
| `/persona/partner/data`                              | GET    | `organizationId` + `partnerId` in query  | ⚠️ PARTIAL         | `organizationId` can be from token, keep `partnerId` - Line 19 of partner-match.ts |
| `/persona/partner-data-permissions/{organizationId}` | GET    | `organizationId` in path                 | ✅ CAN BE IMPROVED | Used in `fetchPermission()` - Line 44 of partner-match.ts                          |
| `/persona/partner/permissions`                       | POST   | `organizationId` in request body         | ✅ CAN BE IMPROVED | Used in `changePermission()` - Line 79 of partner-match.ts                         |
| `/persona/overlap/my-records`                        | GET    | `organizationId` in query params         | ✅ CAN BE IMPROVED | Used in `fetchPreview()` - Lines 99-109 of partner-match.ts                        |
| `/persona/overlap/my-records`                        | DELETE | `organizationId` + `recordType` in query | ✅ CAN BE IMPROVED | Used in `deletePreview()` - Line 122 of partner-match.ts                           |

### HubSpot Integration APIs (from field-mapping page)

| Endpoint            | Method | Current Usage                    | Status             | Notes                                  |
| ------------------- | ------ | -------------------------------- | ------------------ | -------------------------------------- |
| `/api/hubspot-data` | GET    | `organizationId` in query params | ✅ CAN BE IMPROVED | Line 514 of customer-insights/page.tsx |

---

## 2. DASHBOARD FOLDER APIs

### Collaboration APIs

| Endpoint                                            | Method | Current Usage                    | Status                | Notes                                                                            |
| --------------------------------------------------- | ------ | -------------------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `/organizationCollaboration/my-partners`            | GET    | No orgId needed                  | ✓ ALREADY OPTIMIZED   | Backend extracts from token - Line 9 of organization-collaborations.ts           |
| `/organizationCollaboration/partner-details`        | GET    | No orgId needed                  | ✓ ALREADY OPTIMIZED   | Backend extracts from token - Line 23 of organization-collaborations.ts          |
| `/organizationCollaboration/id`                     | GET    | Uses `id` param (not orgId)      | ❌ CANNOT BE IMPROVED | Fetches by collaboration ID - Line 50 of organization-collaborations.ts          |
| `/orgUserMapping/allByOrganizationId`               | GET    | `id` in query params             | ✅ CAN BE IMPROVED    | Used in `getAsignSegmentData()` - Line 36 of organization-collaborations.ts      |
| `/organizationCollaboration/collaboration-category` | POST   | `organizationId` in request body | ✅ CAN BE IMPROVED    | Used in `createCollaborationGroup()` - Line 69 of organization-collaborations.ts |

---

## 3. OFFLINE-PARTNERS FOLDER APIs

### Offline Partner APIs

| Endpoint                              | Method | Current Usage                        | Status                | Notes                                                              |
| ------------------------------------- | ------ | ------------------------------------ | --------------------- | ------------------------------------------------------------------ |
| `/v2/offline-partner`                 | GET    | `organizationId` + `status` in query | ✅ CAN BE IMPROVED    | Used in `getOfflinePartners()` - Line 17 of offline-partners.ts    |
| `/v2/offline-partner/group`           | POST   | `organizationId` in request body     | ✅ CAN BE IMPROVED    | Used in `addPartnersToGroup()` - Line 41 of offline-partners.ts    |
| `/v2/offline-partner`                 | DELETE | `organizationId` in request body     | ✅ CAN BE IMPROVED    | Used in `deleteOfflinePartners()` - Line 61 of offline-partners.ts |
| `/v2/offline-partner/invite`          | POST   | `organizationId` in request body     | ✅ CAN BE IMPROVED    | Used in `sendInvite()` - Line 83 of offline-partners.ts            |
| `/v2/offline-partner/save`            | POST   | `organizationId` in request body     | ✅ CAN BE IMPROVED    | Used in `importPartners()` - Line 102 of offline-partners.ts       |
| `/v2/offline-partner/details/id`      | GET    | Uses `id` param (not orgId)          | ❌ CANNOT BE IMPROVED | Fetches by partner ID - Line 118 of offline-partners.ts            |
| `/v2/offline-partner/partner-details` | PATCH  | `organizationId` in request body     | ✅ CAN BE IMPROVED    | Used in `updateOfflinePartner()` - Line 145 of offline-partners.ts |
| `/v2/offline-partner/uploadContract`  | POST   | `organizationId` in multipart form   | ✅ CAN BE IMPROVED    | Used in `uploadContractFile()` - Line 179 of offline-partners.ts   |
| `/v2/offline-partner/sign-document`   | POST   | `organizationId` in query params     | ✅ CAN BE IMPROVED    | Used in `addSignedDocument()` - Line 204 of offline-partners.ts    |
| `/v2/offline-partner/contract`        | GET    | `organizationId` + `email` in query  | ✅ CAN BE IMPROVED    | Used in `getContractByEmail()` - Line 230 of offline-partners.ts   |
| `/v2/offline-partner/documents`       | GET    | `organizationId` in query params     | ✅ CAN BE IMPROVED    | Used in `getDocumentsByOrgId()` - Line 244 of offline-partners.ts  |

---

## 4. INTEGRATIONS FOLDER APIs

### Integration APIs

| Endpoint                      | Method | Current Usage                    | Status              | Notes                                                                 |
| ----------------------------- | ------ | -------------------------------- | ------------------- | --------------------------------------------------------------------- |
| `/organization/integration`   | GET    | No orgId needed                  | ✓ ALREADY OPTIMIZED | Backend extracts from token - Line 40 of organizations.ts (db folder) |
| `/organization/integration`   | POST   | `organizationId` in request body | ✅ CAN BE IMPROVED  | Used in `Postintegrationdata()` - Line 60 of organizations.ts         |
| `/organization/integration`   | PATCH  | `organizationId` in request body | ✅ CAN BE IMPROVED  | Used in `PatchIntegrationData()` - Line 79 of organizations.ts        |
| `/api/get-referral-campaigns` | GET    | `organizationId` in query params | ✅ CAN BE IMPROVED  | Line 73 of integrations/referral-programs/page.tsx                    |

### Other Organization APIs (from organizations.ts)

| Endpoint                        | Method | Current Usage                              | Status             | Notes                                                                |
| ------------------------------- | ------ | ------------------------------------------ | ------------------ | -------------------------------------------------------------------- |
| `/organization/bookmark`        | GET    | `organizationId` in query params           | ✅ CAN BE IMPROVED | Used in `getSavedOrganizations()` - Line 247 of organizations.ts     |
| `/organization/bookmark`        | POST   | `organizationId` + `partnerOrganizationId` | ⚠️ PARTIAL         | Current org can be from token - Line 277 of organizations.ts         |
| `/organization/getting-started` | GET    | `organizationId` in query params           | ✅ CAN BE IMPROVED | Used in `getGetStartedDetails()` - Line 301 of organizations.ts      |
| `/partnership-integration`      | GET    | `organizationId` in query params           | ✅ CAN BE IMPROVED | Used in `getPartnershipIntegration()` - Line 339 of organizations.ts |
| `/organization/addPartner`      | POST   | `organizationId` in query params           | ✅ CAN BE IMPROVED | Used in `addPartner()` - Line 365 of organizations.ts                |
| `/user/addUser`                 | POST   | `organizationId` in query params           | ✅ CAN BE IMPROVED | Used in `inviteTeamMember()` - Line 381 of organizations.ts          |

---

## Summary Statistics

### Total APIs Analyzed: 35

- **✅ CAN BE IMPROVED: 29 APIs** (83%)
- **⚠️ PARTIAL: 2 APIs** (6%)
- **✓ ALREADY OPTIMIZED: 2 APIs** (6%)
- **❌ CANNOT BE IMPROVED: 2 APIs** (6%)

---

## Recommended Implementation Approach

### Backend Changes (Preferred)

1. **Modify backend endpoints** to extract `organizationId` from JWT token
2. Use middleware to validate and inject orgId into request context
3. Remove organizationId from request parameters where it refers to current user's org

### Benefits of Backend Approach

- ✅ More secure (can't spoof organizationId)
- ✅ Reduces payload size
- ✅ Simplifies frontend code
- ✅ Prevents potential authorization bugs
- ✅ Single source of truth

### Frontend Changes (If backend can't be modified)

1. Create a wrapper service layer that automatically injects orgId from Redux store
2. Update all API calls to use the wrapper
3. Keep token-based orgId extraction on frontend

---

## Priority Recommendation

### High Priority (Security & Data Integrity)

- All POST/PATCH/DELETE operations where organizationId determines data ownership
- APIs dealing with partner invites, groups, and permissions

### Medium Priority (Code Quality)

- GET operations that fetch data for current organization
- Integration-related APIs

### Low Priority (Already Handled)

- APIs that already extract orgId from token on backend
- APIs that need orgId for other organizations (like partnerId)

---

## Example Implementation

### Before (Current)

```typescript
export const fetchMyPersona = async (organizationId: number) => {
  const response = await fetcher(
    `/persona/details?organizationId=${organizationId}`,
    {
      method: 'GET'
    }
  )
  return response
}
```

### After (Improved - Backend extracts from token)

```typescript
export const fetchMyPersona = async () => {
  const response = await fetcher(`/persona/details?page=0&size=20`, {
    method: 'GET'
    // Backend extracts organizationId from JWT token
  })
  return response
}
```

---

## Next Steps

1. **Review with backend team** to confirm feasibility of token-based extraction
2. **Create migration plan** to update APIs one module at a time
3. **Update frontend code** to remove organizationId parameters
4. **Add tests** to ensure authorization is properly enforced
5. **Deploy gradually** with feature flags for safety

---

_Generated on: 2025-10-01_
_Analysis covers: my-data, dashboard, offline-partners, integrations folders_
