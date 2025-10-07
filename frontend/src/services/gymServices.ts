import axiosInstance from './axiosInstance'
import type { IOwnerGym, ApiResponse } from '@/types/owner'
import { API_ROUTES } from '@/constants/apiRoutes'

export const GymService = {
  getGyms: async (): Promise<IOwnerGym[]> => {
    const { data } = await axiosInstance.get<ApiResponse<IOwnerGym[]>>(API_ROUTES.GYM.GET_GYM)

    return data.data
  },
}
