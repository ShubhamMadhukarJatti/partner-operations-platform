# Integration Updates Summary

This document summarizes the updates made to ensure both Google Sheets (G_SHEET) and Google Forms (G_FORM) integrations properly update to the backend.

## Issues Fixed

### 1. Missing User ID in Backend Integration

**Problem**: The `createOrganizationIntegration` function was not sending the required `userId` field to the backend API.

**Solution**:

- Added `userId` state management in the partner program page
- Updated the function to include `userId` in the payload
- Made `userId` optional in the API route to handle cases where it might not be available

### 2. Inconsistent Error Handling and Logging

**Problem**: Different levels of logging and error handling between sheets and forms integrations.

**Solution**:

- Standardized logging across both `sheets.ts` and `forms.ts`
- Added comprehensive error handling with proper error messages
- Added detailed console logs for debugging integration issues

### 3. Integration Type Detection

**Problem**: The partner program page had confusing logic for determining integration types.

**Solution**:

- Simplified the logic to directly look for `INTEGRATIONS.GOOGLE_FORM`
- Added clear logging to show which refresh tokens are found
- Updated the step progression logic to handle Google Forms as step 1

## Files Updated

### 1. `src/app/(app)/(dashboard-pages)/home/partner-program/page.tsx`

**Changes**:

- Added `userId` state management
- Fixed `createOrganizationIntegration` function to include `userId`
- Updated integration type detection logic
- Added comprehensive logging for debugging
- Fixed step progression logic for Google Forms integration

**Key Updates**:

```typescript
// Added userId state
const [userId, setUserId] = useState<string>('')

// Updated integration function
const createOrganizationIntegration = async (
  refreshToken: string,
  integrationType: string
) => {
  const payload = {
    organizationId: user,
    refreshToken: refreshToken,
    integrationType: integrationType,
    isConnected: true,
    userId: userId // Now included
  }
  // ... rest of function
}
```

### 2. `src/app/api/organization/integration/route.ts`

**Changes**:

- Made `userId` field optional in validation
- Added detailed logging for integration creation
- Improved error handling with better error messages

**Key Updates**:

```typescript
// Made userId optional
if (!organizationId || !refreshToken || !integrationType) {
  // userId is now optional
}

// Added logging
console.log('Creating integration:', {
  organizationId,
  integrationType,
  userId: userId || 'Not provided'
})
```

### 3. `src/lib/db/sheets.ts`

**Changes**:

- Added comprehensive logging
- Improved error handling
- Standardized with forms.ts implementation

**Key Updates**:

```typescript
console.log('Getting Google Sheets access token...')
console.log('Google Sheets token response:', {
  hasAccessToken: !!tokenResponse.access_token,
  hasRefreshToken: !!tokenResponse.refresh_token,
  error: tokenResponse.error
})
```

### 4. `src/lib/db/forms.ts`

**Changes**:

- Added comprehensive logging
- Improved error handling
- Added proper error checking for OAuth responses

**Key Updates**:

```typescript
if (tokenResponse.error) {
  throw new Error(`Google OAuth error: ${tokenResponse.error}`)
}

if (!accessToken) {
  throw new Error('No access token received from Google')
}
```

### 5. `src/app/api/auth/[...nextauth]/route.ts`

**Changes**:

- Updated to detect Google Forms scopes
- Added proper integration type detection for forms

**Key Updates**:

```typescript
// Determine the integration type based on the scope
let currentServiceType: string

if (account.scope?.includes('spreadsheets.readonly')) {
  currentServiceType = INTEGRATIONS.GOOGLE_SHEET
} else if (account.scope?.includes('forms')) {
  currentServiceType = INTEGRATIONS.GOOGLE_FORM
} else {
  currentServiceType = INTEGRATIONS.GOOGLE_MEET
}
```

## New Files Created

### 1. `src/components/integration-test.tsx`

A test component to verify both integrations are working correctly.

**Features**:

- Tests both Google Sheets and Google Forms integrations
- Shows connected apps and their status
- Displays access token retrieval results
- Provides debugging information

### 2. `src/components/google-forms-example.tsx`

Example component demonstrating Google Forms integration usage.

### 3. `src/http-hooks/google-forms.ts`

React hooks for Google Forms integration.

### 4. `src/app/api/google-forms/route.ts`

API route for Google Forms data and responses.

## How Both Integrations Now Work

### 1. OAuth Flow

1. User clicks "Connect Google Form" or "Connect Google Sheet"
2. NextAuth handles the OAuth flow with appropriate scopes
3. Refresh token is automatically stored in the database
4. Integration type is detected based on the requested scopes

### 2. Backend Integration

1. When the page loads, it fetches existing connected apps
2. For each integration type (G_SHEET, G_FORM), it calls `createOrganizationIntegration`
3. The function sends the refresh token, organization ID, user ID, and integration type to the backend
4. Backend stores the integration data and returns success/error

### 3. Token Management

1. Both integrations use the same token refresh mechanism
2. When new refresh tokens are received, they're automatically stored
3. Access tokens are obtained on-demand and not persisted
4. Error handling ensures failed token refreshes are properly logged

## Testing

Use the `IntegrationTest` component to verify both integrations:

```typescript
import { IntegrationTest } from '@/components/integration-test'

// In your component
<IntegrationTest />
```

This will show:

- Connected apps and their status
- Test results for both integrations
- Access token retrieval success/failure
- Detailed error messages if something goes wrong

## Verification Steps

1. **Connect Google Forms**: Should create integration with type 'G_FORM'
2. **Connect Google Sheets**: Should create integration with type 'G_SHEET'
3. **Check Backend**: Both should appear in the connected apps list
4. **Test Tokens**: Both should be able to retrieve fresh access tokens
5. **Check Logs**: Console should show detailed integration creation logs

## Environment Variables Required

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SHARKDOM_API_URL=your_backend_api_url
```

Both integrations are now properly configured to update to the backend and should work consistently.
