export interface IStripeEventLogRepository {
  createIfNotExists(
    eventId: string,
    type: string,
    status: 'PROCESSING' | 'SUCCESS' | 'FAILED'
  ): Promise<boolean>
  updateStatus(
    eventId: string,
    status: 'PROCESSING' | 'SUCCESS' | 'FAILED',
    errorMessage?: string
  ): Promise<void>
  isProcessed(eventId: string): Promise<boolean>
}
