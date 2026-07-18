/**
 * Validate if URL is likely a PDF or document
 */
export const isValidDocumentUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    // Check for common document extensions
    const documentExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx'
    ]
    const hasDocumentExtension = documentExtensions.some((ext) =>
      pathname.endsWith(ext)
    )
    // Also check if it's a Google Drive or similar document link
    const isDocumentHost =
      urlObj.hostname.includes('drive.google.com') ||
      urlObj.hostname.includes('docs.google.com') ||
      urlObj.hostname.includes('dropbox.com') ||
      urlObj.hostname.includes('onedrive.com') ||
      hasDocumentExtension
    return isDocumentHost
  } catch {
    return false
  }
}

/**
 * Validate if URL is a Google Drive link
 */
export const isValidGoogleDriveUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false
  try {
    const urlObj = new URL(url)
    return (
      urlObj.hostname === 'drive.google.com' ||
      urlObj.hostname.includes('drive.google.com')
    )
  } catch {
    return false
  }
}

/**
 * Convert Google Drive URL to previewable format for iframe
 */
export const getGoogleDrivePreviewUrl = (url: string): string => {
  if (!url || !url.trim()) return url

  try {
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      // Extract file ID from various Google Drive URL formats
      // Format 1: https://drive.google.com/file/d/FILE_ID/view
      // Format 2: https://drive.google.com/open?id=FILE_ID
      // Format 3: https://drive.google.com/uc?id=FILE_ID
      // Format 4: https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
      let fileId = ''

      // Try to extract from /file/d/FILE_ID/ pattern (most common)
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (fileIdMatch) {
        fileId = fileIdMatch[1]
      } else {
        // Try to extract from ?id= pattern
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
        if (idMatch) {
          fileId = idMatch[1]
        }
      }

      if (fileId) {
        // Convert to preview format for embedding
        // This requires the file to be shared with "Anyone with the link" permission
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
    }

    return url
  } catch {
    return url
  }
}
