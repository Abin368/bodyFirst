export interface IMemberProfile {
  _id: string
  userId: string
  gymId: string
  contactNo: string
  address: {
    street: string
    city: string
    district: string
    state: string
    pincode: string
  }
  status: 'PENDING' | 'ACTIVE' | 'REJECTED'
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  age: number
  heightCm: number
  weightKg: number
  activityLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  images: string[]
  joinDate?: Date
  lastActiveAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  message: string
  data: T
}
