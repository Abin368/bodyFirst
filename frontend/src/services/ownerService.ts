import axiosInstance from './axiosInstance'
import type { ApiResponse, OwnerProfile } from '@/types/owner'

export const OwnerService = {
  getProfile: async (): Promise<OwnerProfile> => {
    const { data } = await axiosInstance.get<ApiResponse<OwnerProfile>>('/owner/profile/me')
    return data.data
  },
}
