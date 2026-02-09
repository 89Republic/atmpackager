// Use internal Next.js API route to avoid CORS
const API_BASE_URL = '/api/v1'

export interface Client {
  clientId?: number
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
  async getActive(): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/clients/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Client[]> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch active clients')
    }

    return result.data
  },
  async create(payload: Client): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    let result: ApiResponse<Client> | null = null

    try {
      result = await response.json()
    } catch {
      result = null
    }

    if (!response.ok) {
      const message = result?.message || `HTTP error! status: ${response.status}`
      throw new Error(message)
    }

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to create client')
    }

    return result.data
  },
  async update(payload: Client): Promise<Client> {
    if (!payload.clientId) {
      throw new Error('clientId is required to update a client')
    }

    
    const response = await fetch(`${API_BASE_URL}/clients/${payload.clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    let result: ApiResponse<Client> | null = null

    try {
      result = await response.json()
    } catch {
      result = null
    }

    if (!response.ok) {
      const message = result?.message || `HTTP error! status: ${response.status}`
      throw new Error(message)
    }

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to update client')
    }

    return result.data
  },
}
