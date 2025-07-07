export class MizbanCloudError extends Error {
  public readonly statusCode: number
  public readonly response?: any
  public readonly timestamp: string

  constructor(message: string, statusCode: number = 500, response?: any) {
    super(message)
    this.name = 'MizbanCloudError'
    this.statusCode = statusCode
    this.response = response
    this.timestamp = new Date().toISOString()

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, MizbanCloudError)
  }
}
