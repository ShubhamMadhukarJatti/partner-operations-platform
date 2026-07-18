# Pipedrive OAuth Integration Debug Guide

## �� Issue Summary

You were getting the error `{"error":"Failed to connect to Pipedrive"}` when trying to connect Pipedrive integration.

## 🚨 Root Causes Identified & Fixed

### 1. **Environment Variable Mismatch** ✅ FIXED

- **Problem**: Inconsistent environment variable names across the codebase
- **Integration drawer**: Uses `NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL`
- **Callback route**: Was using `NEXT_PUBLIC_PIPEDRIVE_REDIRECTION_URL`
- **Status**: Fixed in the callback route

### 2. **Authorization Code Expiration** ✅ FIXED

- **Problem**: OAuth authorization codes expire after 10 minutes, causing "invalid_grant" errors
- **Root Cause**: Delay between OAuth initiation and callback processing
- **Solution**: Added timestamp tracking and immediate code validation

### 3. **Missing Environment Variables**

The following environment variables must be configured:

```bash
# Required for Pipedrive OAuth
NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID=your_pipedrive_client_id
NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET=your_pipedrive_client_secret
NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL=http://localhost:3000/api/pipedrive/callback

# Required for backend integration
SHARKDOM_API_URL=your_backend_api_url
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional Pipedrive configuration
NEXT_PUBLIC_PIPEDRIVE_SCOPES=deals:read,deals:write,contacts:read,contacts:write
NEXT_PUBLIC_PIPEDRIVE_STATE=your_custom_state_value
```

## 🛠️ Comprehensive Fixes Implemented

### ✅ **Enhanced Error Handling**

- **Specific OAuth Error Handling**: Now handles `invalid_grant` and expired codes gracefully
- **User-Friendly Redirects**: Users are redirected with clear error messages instead of generic failures
- **Code Age Validation**: Authorization codes are validated for expiration before processing

### ✅ **Timestamp Tracking**

- **OAuth Initiation**: Added timestamps to state parameters when starting OAuth flow
- **Code Age Monitoring**: Tracks how long authorization codes have been active
- **Automatic Expiration Handling**: Redirects users to restart OAuth if codes are too old

### ✅ **Improved Logging & Debugging**

- **Comprehensive Logging**: Added detailed logging throughout the OAuth flow
- **Timing Information**: Tracks when each step occurs
- **Error Context**: Provides detailed error information for debugging

### ✅ **Code Validation**

- **Format Validation**: Ensures authorization codes meet minimum length requirements
- **Immediate Processing**: Codes are processed as soon as they're received
- **Redirect URI Validation**: Ensures exact match with Pipedrive app configuration

## 🚀 How the Fix Works

### 1. **OAuth Initiation**

```typescript
// Now includes timestamp in state parameter
const state = JSON.stringify({
  timestamp: Date.now(),
  source: 'integration-drawer'
})
```

### 2. **Callback Processing**

```typescript
// Validates code age and handles expiration
if (codeTimestamp) {
  const codeAge = Date.now() - parseInt(codeTimestamp)
  const maxAge = 10 * 60 * 1000 // 10 minutes

  if (codeAge > maxAge) {
    // Redirect user to restart OAuth flow
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=code_expired&message=Authorization+code+expired.+Please+try+connecting+again.`
    )
  }
}
```

### 3. **Error Handling**

```typescript
// Specific handling for expired codes
if (responseData.error === 'invalid_grant' && responseData.message?.includes('expired')) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=code_expired&message=Authorization+code+expired.+Please+try+connecting+again.`
  )
}
```

## 🛠️ Debugging Steps

### Step 1: Check Environment Variables

1. Create a `.env.local` file in your project root
2. Add the required environment variables above
3. Restart your development server

### Step 2: Verify Pipedrive App Configuration

1. Go to [Pipedrive Developer Portal](https://developers.pipedrive.com/)
2. Check your app's OAuth settings:
   - **Redirect URI**: Must match `NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL`
   - **Client ID**: Must match `NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID`
   - **Client Secret**: Must match `NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET`

### Step 3: Check Console Logs

The enhanced logging now shows:

- 🔍 OAuth callback start with timestamp
- 📋 URL parameters received
- 👤 User authentication status
- 🏢 Organization details
- 🔧 Environment variable status
- ⏰ Code age validation
- 📤 Token exchange request details
- 📥 Pipedrive API responses
- 🚀 Backend integration requests
- 💥 Detailed error information

### Step 4: Common Issues & Solutions

#### Issue: "Authorization code expired"

- **Cause**: OAuth flow took too long (>10 minutes)
- **Solution**: ✅ **AUTOMATICALLY HANDLED** - User is redirected to restart OAuth

#### Issue: "Invalid grant error"

- **Cause**: Authorization code issues
- **Solution**: ✅ **AUTOMATICALLY HANDLED** - User is redirected with clear instructions

#### Issue: "Missing authorization code"

- **Cause**: OAuth flow not properly initiated
- **Solution**: Ensure the redirect URI in Pipedrive matches exactly

## 🔧 Enhanced Error Handling

The callback route now includes:

- ✅ Environment variable validation
- ✅ Authorization code age validation
- ✅ Specific OAuth error handling
- ✅ User-friendly error redirects
- ✅ Comprehensive debugging information
- ✅ Timestamp tracking for code lifecycle

## 📝 Next Steps

1. **Configure Environment Variables**: Use the template above
2. **Test OAuth Flow**: Try connecting Pipedrive again
3. **Check Console Logs**: Look for the detailed logging output
4. **Verify Pipedrive App Settings**: Ensure OAuth configuration matches

## 🆘 If Issues Persist

1. Check the browser console for detailed error logs
2. Verify all environment variables are set correctly
3. Ensure Pipedrive app OAuth settings match your configuration
4. Check if the backend API endpoint is accessible

## 📞 Support

If you continue to experience issues, provide:

- Console log output from the enhanced logging
- Environment variable configuration (mask sensitive values)
- Pipedrive app OAuth settings screenshot
- Any specific error messages received

## 🎯 Expected Behavior Now

- **Fast OAuth Flow**: Codes are processed immediately upon receipt
- **Clear Error Messages**: Users see specific error messages instead of generic failures
- **Automatic Recovery**: Expired codes automatically redirect users to restart
- **Comprehensive Logging**: Full visibility into the OAuth process for debugging
