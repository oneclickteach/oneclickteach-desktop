import { MizbanCloudError } from '../errors/MizbanCloudError'
import { HttpClient } from '../utils/http'

export abstract class BaseService {
  protected client: HttpClient
  protected basePath: string

  constructor(client: HttpClient, basePath: string) {
    this.client = client
    this.basePath = basePath
  }

  protected buildPath(endpoint: string): string {
    return `${this.basePath}${endpoint}`
  }

  protected async withRetry<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error('An unknown error occurred')

        if (attempt === maxRetries) break

        // Only retry on network errors or 5xx status codes
        if (error instanceof MizbanCloudError) {
          if (error.statusCode >= 400 && error.statusCode < 500) {
            break // Don't retry client errors
          }
        }

        await new Promise((resolve) => setTimeout(resolve, delay * attempt))
      }
    }

    throw lastError
  }
}
