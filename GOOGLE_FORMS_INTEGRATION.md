# Google Forms Integration

This document explains how to use the Google Forms integration in the Sharkdom application.

## Overview

The Google Forms integration allows you to:

- Connect to Google Forms using OAuth2
- Store refresh tokens securely
- Fetch forms data and responses
- Integrate with the partner program workflow

## Files Created

### 1. `src/lib/db/forms.ts`

Main integration file that handles:

- Getting access tokens from refresh tokens
- Storing new refresh tokens in the database
- Fetching Google Forms data and responses

### 2. `src/app/api/google-forms/route.ts`

API route that provides:

- GET endpoint to fetch forms data
- POST endpoint to fetch form responses
- Automatic token refresh handling

### 3. `src/http-hooks/google-forms.ts`

React hooks for:

- `useGoogleForms()` - Fetch forms data
- `useGoogleFormsResponses()` - Fetch form responses
- `useGoogleFormsConnection()` - Check connection status

### 4. `src/components/google-forms-example.tsx`

Example component demonstrating usage

## Setup

### 1. Environment Variables

Ensure these environment variables are set:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Google OAuth Configuration

In your Google Cloud Console:

1. Enable the Google Forms API
2. Add the following scopes to your OAuth consent screen:
   - `https://www.googleapis.com/auth/forms`
   - `https://www.googleapis.com/auth/drive.metadata.readonly`

## Usage

### 1. Connecting Google Forms

The integration is automatically handled when users connect through the partner program page:

```typescript
import { signIn } from 'next-auth/react'

const handleConnectForms = () => {
  signIn('google', undefined, {
    scope:
      'openid https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/drive.metadata.readonly'
  })
}
```

### 2. Getting Access Token

```typescript
import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getFormsAccessToken } from '@/lib/db/forms'
import { fetchconnectedApps } from '@/lib/db/organization'

const getAccessToken = async () => {
  const apps = await fetchconnectedApps()
  const refreshToken = apps.find(
    (app: any) => app.integrationType === INTEGRATIONS.GOOGLE_FORM
  )?.refreshToken

  if (refreshToken) {
    const accessToken = await getFormsAccessToken(refreshToken)
    return accessToken
  }
}
```

### 3. Using React Hooks

```typescript
import {
  useGoogleForms,
  useGoogleFormsResponses
} from '@/http-hooks/google-forms'

// Fetch all forms
const { data: formsData, isLoading, error } = useGoogleForms()

// Fetch specific form
const { data: formData } = useGoogleForms('form_id_here')

// Fetch form responses
const { mutate: fetchResponses, data: responsesData } =
  useGoogleFormsResponses()

// Usage
fetchResponses('form_id_here')
```

### 4. API Endpoints

#### GET `/api/google-forms`

Fetch all forms or a specific form:

```typescript
// All forms
const response = await fetch('/api/google-forms')

// Specific form
const response = await fetch('/api/google-forms?formId=your_form_id')
```

#### POST `/api/google-forms`

Fetch form responses:

```typescript
const response = await fetch('/api/google-forms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ formId: 'your_form_id' })
})
```

## Integration with Partner Program

The Google Forms integration is used in the partner program workflow:

1. **Step 1**: Connect Google Form
2. **Step 2**: Connect Google Sheet
3. **Step 3**: Enable Web App Integration
4. **Step 4**: Deploy Changes
5. **Step 5**: Set Trigger
6. **Step 6**: Test Webhook
7. **Step 7**: Go Live

The integration automatically:

- Stores refresh tokens when users connect
- Refreshes access tokens when needed
- Handles OAuth flow seamlessly

## Error Handling

The integration includes comprehensive error handling:

```typescript
try {
  const accessToken = await getFormsAccessToken(refreshToken)
  // Use access token
} catch (error) {
  console.error('Error getting access token:', error)
  // Handle error appropriately
}
```

## Security

- Refresh tokens are stored securely in the database
- Access tokens are not persisted and are refreshed as needed
- OAuth2 flow ensures secure authentication
- All API calls use proper authorization headers

## Testing

Use the example component to test the integration:

```typescript
import { GoogleFormsExample } from '@/components/google-forms-example'

// In your component
<GoogleFormsExample />
```

This component provides:

- Manual access token retrieval
- Forms listing
- Response fetching
- Error handling examples

## Troubleshooting

### Common Issues

1. **"Refresh token is missing"**

   - Ensure the user has connected Google Forms through the OAuth flow
   - Check that the integration type is correctly set to 'G_FORM'

2. **"Failed to obtain access token"**

   - Verify environment variables are set correctly
   - Check that the refresh token is valid and not expired

3. **"Google Forms API error"**
   - Ensure Google Forms API is enabled in Google Cloud Console
   - Verify the OAuth scopes include forms access

### Debug Mode

Enable debug logging by setting:

```env
NEXTAUTH_DEBUG=true
```

This will show detailed logs in the console for troubleshooting OAuth issues.
