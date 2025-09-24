import axiosInstance from './axiosInstance'
import type { ApiResponse, OwnerProfile } from '@/types/owner'
import { API_ROUTES } from '@/constants/apiRoutes'

export const OwnerService = {
  getProfile: async (): Promise<OwnerProfile> => {
    const { data } = await axiosInstance.get<ApiResponse<OwnerProfile>>(API_ROUTES.OWNER.PROFILE_ME)
    return data.data
  },
}
