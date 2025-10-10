import { IOwnerGym } from '../../models/owner/IOwnerGym'

export interface IGymRepository {
  findActiveGymsWithSearch(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<{ gyms: IOwnerGym[]; totalGyms: number; totalPages: number; currentPage: number }>
}
