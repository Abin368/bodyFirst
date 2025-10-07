export interface OwnerProfile {
  _id: string
  userId: string
  gymId: string
  // gymName: string
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CroppedAreaPixels {
  x: number
  y: number
  width: number
  height: number
}

export interface IOwnerGym {
  _id: string
  ownerId: string
  name: string
  address: {
    city: string
    state: string
    street: string
    pincode: string
  }
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  contactNo?: string
  website?: string
  logoUrl?: string
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface IOwnerProfile {
  _id: string
  userId: string
  gymId: string
  contactNo: string
  website?: string
  trainerIds: string[]
  numberOfTrainers: number
  services: string[]
  plans: Array<{
    name?: string
    price?: number
    duration?: number
  }>
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  subscriptionStart?: string
  subscriptionExpiry?: string
  autoRenew: boolean
  lastPaymentId?: string
  createdAt: string
  updatedAt: string
}

export interface FinalizeGymResponse {
  gym: IOwnerGym
  profile: IOwnerProfile
}

export interface ApiResponse<T> {
  message: string
  data: T
}
