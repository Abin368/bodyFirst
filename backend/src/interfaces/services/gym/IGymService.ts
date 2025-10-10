import { IOwnerGym } from '../../models/owner/IOwnerGym'

export interface IGymService {
  getActiveGyms(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<{
    gyms: IOwnerGym[]
    totalGyms: number
    totalPages: number
    currentPage: number
  }>
}
