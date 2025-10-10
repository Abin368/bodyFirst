import type { IOwnerGym } from './owner'
export interface GymQuery {
  page?: number
  limit?: number
  search?: string
}

export interface GymListResponse {
  gyms: IOwnerGym[]
  totalPages: number
  currentPage: number
  totalGyms: number
}
