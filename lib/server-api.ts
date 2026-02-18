const rawServerApiBaseUrl = process.env.BACKEND_API_BASE_URL || 'http://10.203.14.33:8182/atm-packager/api/v1'

export const SERVER_API_BASE_URL = rawServerApiBaseUrl.replace(/\/$/, '')
