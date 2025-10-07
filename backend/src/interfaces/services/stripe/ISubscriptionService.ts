export interface ISubscriptionService {
  expireSubscriptions(): Promise<number>
}
