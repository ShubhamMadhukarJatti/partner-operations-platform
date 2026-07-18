import { useMutation, useQuery } from '@tanstack/react-query'

// Hook to fetch Google Forms data
export const useGoogleForms = (formId?: string) => {
  return useQuery({
    queryKey: ['google-forms', formId],
    queryFn: async () => {
      if (!formId) {
        throw new Error('Form ID is required to fetch Google Forms data')
      }

      const response = await fetch(`/api/google-forms?formId=${formId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch Google Forms data')
      }
      return response.json()
    },
    enabled: !!formId, // Only run if formId is provided
    retry: 2
  })
}

// Hook to fetch Google Forms responses
export const useGoogleFormsResponses = () => {
  return useMutation({
    mutationFn: async (formId: string) => {
      const response = await fetch('/api/google-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formId })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Google Forms responses')
      }
      return response.json()
    }
  })
}

// Hook to check if Google Forms is connected
export const useGoogleFormsConnection = () => {
  return useQuery({
    queryKey: ['google-forms-connection'],
    queryFn: async () => {
      // Try to get a test form to check if connection works
      // We'll use a dummy form ID to test the connection
      const response = await fetch('/api/google-forms?formId=test')
      // If we get a 400 with "Form ID is required" or "refresh token is missing",
      // it means the API is working but we need a real form ID
      return response.status !== 500 // Consider it connected if not a server error
    },
    retry: false
  })
}
