// Use internal Next.js API route to avoid CORS
const API_BASE_URL = '/api/v1'

export interface Client {
  clientName: string
  active: string
  bitmapType: string
  encoding: string
  isoVersion: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure client-side fetch doesn't cache
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Client[]> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients')
    }

    return result.data
  },
}
