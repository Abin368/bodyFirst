import axiosInstance from './axiosInstance'
import type { IOwnerGym, ApiResponse } from '@/types/owner'
import { API_ROUTES } from '@/constants/apiRoutes'
import type { GymQuery } from '@/types/gym'
import type { GymListResponse } from '@/types/gym'

export const GymService = {
  getGyms: async ({
    page = 1,
    limit = 9,
    search = '',
  }: GymQuery = {}): Promise<GymListResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<IOwnerGym[]>>(API_ROUTES.GYM.GET_GYM, {
      params: { page, limit, search },
    })

    return {
      gyms: data.data,
      totalPages: data.totalPages ?? 1,
      currentPage: data.page ?? page,
      totalGyms: data.total ?? data.data.length,
    }
  },
}
