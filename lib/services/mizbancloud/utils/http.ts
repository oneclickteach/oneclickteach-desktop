import { MizbanCloudError } from '../errors/MizbanCloudError'
import { ApiResponse, RequestOptions } from '../types'

export class HttpClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseUrl: string, apiKey: string, timeout: number = 30000) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    this.timeout = timeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = { ...this.defaultHeaders, ...options.headers }
    const timeout = options.timeout || this.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (!response.ok) {
        throw new MizbanCloudError(responseData.error || `HTTP ${response.status}`, response.status, responseData)
      }

      return {
        success: true,
        data: responseData.data || responseData,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof MizbanCloudError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new MizbanCloudError('Request timeout', 408)
        }
        throw new MizbanCloudError(error.message || 'Network error', 0, error)
      }

      // Handle other types of errors
      throw new MizbanCloudError('Unknown error', 0, error)
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options)
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options)
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options)
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options)
  }
}
