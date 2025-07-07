import { MizbanCloudError } from './errors/MizbanCloudError'
import { ServerService } from './services/ServerService'
import { StaticService } from './services/StaticService'
import { MizbanCloudConfig } from './types'
import { HttpClient } from './utils/http'

export class MizbanCloud {
  private config: Required<MizbanCloudConfig>
  private httpClient: HttpClient

  public readonly staticService: StaticService
  public readonly serverService: ServerService

  constructor(config: MizbanCloudConfig) {
    this.config = {
      baseUrl: 'https://auth.mizbancloud.com/api/v1',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    }

    this.validateConfig()

    this.httpClient = new HttpClient(this.config.baseUrl, this.config.apiKey, this.config.timeout)

    // Initialize services
    this.staticService = new StaticService(this.httpClient)
    this.serverService = new ServerService(this.httpClient)
  }

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new MizbanCloudError('API key is required', 400)
    }

    if (!this.config.baseUrl) {
      throw new MizbanCloudError('Base URL is required', 400)
    }

    try {
      new URL(this.config.baseUrl)
    } catch {
      throw new MizbanCloudError('Invalid base URL format', 400)
    }
  }

  // Get current configuration (without sensitive data)
  getConfig(): Omit<Required<MizbanCloudConfig>, 'apiKey'> {
    const { apiKey, ...publicConfig } = this.config
    return publicConfig
  }

  // Update configuration
  updateConfig(newConfig: Partial<MizbanCloudConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.validateConfig()

    // Recreate HTTP client if base URL, API key, or timeout changed
    if (newConfig.baseUrl || newConfig.apiKey || newConfig.timeout) {
      this.httpClient = new HttpClient(this.config.baseUrl, this.config.apiKey, this.config.timeout)
    }
  }
}

// Re-export everything for easy imports
export * from './types'
export * from './errors/MizbanCloudError'
export { MizbanCloud as default }
