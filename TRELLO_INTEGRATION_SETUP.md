# Trello Integration Setup

## Overview

This document explains how to set up Trello OAuth integration for the Sharkdom platform using the Trello API Key flow.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Trello OAuth Configuration
NEXT_PUBLIC_TRELLO_API_KEY=your_trello_api_key_here
NEXT_PUBLIC_TRELLO_REDIRECT_URL=https://yourdomain.com/api/trello/callback
```

## How to Get Trello API Credentials

1. **Go to [Trello Developer Portal](https://trello.com/app-key)**
2. **Log in with your Trello account**
3. **Copy your API Key** (this becomes your `NEXT_PUBLIC_TRELLO_API_KEY`)
4. **Note**: Trello uses API Key + Token flow, not traditional OAuth
5. **Scopes needed**: `read,write,account`

## Integration Flow

1. **User clicks "Connect" on Trello integration**
   - Redirects to `/api/trello`
   - This route redirects to Trello authorization URL

2. **Trello Authorization**
   - User authorizes the application on Trello
   - Trello redirects back to `/api/trello/callback` with token in URL fragment

3. **Token Processing**
   - Frontend extracts token from URL fragment
   - Saves integration data to backend
   - Shows success message

## API Routes

### `/api/trello` (GET)

- Initiates Trello OAuth flow
- Redirects to Trello authorization URL with proper parameters

### `/api/trello/callback` (GET)

- Handles OAuth callback from Trello
- Redirects to frontend for token processing

## Integration Features

- **Read Access**: View boards, lists, and cards
- **Write Access**: Create and update boards, lists, and cards
- **Account Access**: Access user account information
- **Project Management**: Organize partnership projects
- **Team Collaboration**: Share boards with team members

## Testing

To test the integration:

1. Ensure environment variables are set
2. Navigate to `/integrations`
3. Find Trello in the integration list
4. Click "Connect" to start OAuth flow
5. Complete authorization on Trello
6. Verify successful connection

## Troubleshooting

- **Missing API Key**: Ensure `NEXT_PUBLIC_TRELLO_API_KEY` is set
- **Redirect URL Mismatch**: Ensure `NEXT_PUBLIC_TRELLO_REDIRECT_URL` matches your domain
- **Token Issues**: Check Trello API key permissions and scopes
- **Fragment Handling**: Trello returns token in URL fragment, handled by frontend

## Key Differences from Other Integrations

- **Token Location**: Trello returns token in URL fragment (`#token=...`) not query params
- **API Key Flow**: Uses API Key + Token instead of Client ID/Secret
- **Frontend Processing**: Token extraction happens on frontend due to fragment location
