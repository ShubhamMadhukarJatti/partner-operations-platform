import { PostmanItem } from '@/app/(app)/(dashboard-pages)/api-listing/page'

export const processPostmanCollection = (postmanData: any): Endpoint[] => {
  const collection = postmanData.collection || postmanData
  const endpoints: Endpoint[] = []
  let idCounter = 1

  // Set to track unique endpoints (considering endpoint and method)
  const endpointSet = new Set<string>()

  const processItems = (items: PostmanItem[]) => {
    items.forEach((item) => {
      if (item.item) {
        // If the item has sub-items (folder), process them recursively
        processItems(item.item)
      } else if (item.request) {
        const request = item.request
        let endpoint = ''

        // Handle different URL formats
        if (typeof request.url === 'string') {
          // Extract URL without query parameters
          endpoint = request.url.split('?')[0]
        } else if (typeof request.url === 'object') {
          if (request.url.raw) {
            endpoint = request.url.raw.split('?')[0]
          } else if (request.url.path) {
            endpoint = `/${request.url.path.join('/')}`
          }
        }

        // Ensure endpoint and method combination is unique
        const method = request.method || 'GET'
        const uniqueKey = `${method}:${endpoint}`

        if (!endpointSet.has(uniqueKey)) {
          endpointSet.add(uniqueKey)

          endpoints.push({
            id: item.id || String(idCounter++),
            creationTimestamp: new Date().toISOString(),
            lastUpdatedTimestamp: new Date().toISOString(),
            endpoint: endpoint,
            method: method,
            name: item.name
          })
        }
      }
    })
  }

  // Start processing from root items
  if (Array.isArray(collection.item)) {
    processItems(collection.item)
  }

  return endpoints
}

interface SwaggerPathDetails {
  description?: string
  [key: string]: any // To handle additional properties in Swagger details
}

interface SwaggerPaths {
  [path: string]: {
    [method: string]: SwaggerPathDetails
  }
}

interface Endpoint {
  id: string
  creationTimestamp: string
  lastUpdatedTimestamp: string
  endpoint: string
  method: string
  name: string
}

export const processSwaggerEndpoints = (swaggerData: {
  paths: SwaggerPaths
}): Endpoint[] => {
  const endpoints: Endpoint[] = []
  let idCounter = 1

  // Set to track unique endpoints (considering endpoint and method)
  const endpointSet = new Set<string>()

  const processPaths = (paths: SwaggerPaths) => {
    Object.entries(paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        const endpoint = path
        const uniqueKey = `${method}:${endpoint}`

        if (!endpointSet.has(uniqueKey)) {
          endpointSet.add(uniqueKey)

          endpoints.push({
            id: String(idCounter++),
            creationTimestamp: new Date().toISOString(),
            lastUpdatedTimestamp: new Date().toISOString(),
            endpoint: endpoint,
            method: method.toUpperCase(),
            name: details.description || ''
          })
        }
      })
    })
  }

  processPaths(swaggerData.paths)

  return endpoints
}
