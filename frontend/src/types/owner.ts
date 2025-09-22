export interface OwnerProfile {
  _id: string
  userId: string
  gymId: string
  gymName: string
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
