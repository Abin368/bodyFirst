import axiosInstance from './axiosInstance'
import type { IOwnerProfile, FinalizeGymResponse, ApiResponse } from '@/types/owner'
import { API_ROUTES } from '@/constants/apiRoutes'
import type { GymFormValues } from '@/schemas/gym'

export const OwnerService = {
  getProfile: async (): Promise<IOwnerProfile> => {
    const { data } = await axiosInstance.get<ApiResponse<IOwnerProfile>>(
      API_ROUTES.OWNER.PROFILE_ME
    )
    return data.data
  },
  //---------------------------------
  uploadGymImage: async (formData: FormData): Promise<{ key: string; url: string }> => {
    const { data } = await axiosInstance.post(API_ROUTES.OWNER.UPLOAD_IMG, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
  //---------------------------------------
  finalizeGymSetup: async (
    payload: GymFormValues & { tempImageKey?: string }
  ): Promise<FinalizeGymResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<FinalizeGymResponse>>(
      API_ROUTES.OWNER.FINALIZE_GYM,
      payload
    )

    return data.data
  },
  //-----------------------------------------

  handlePayment: async (priceId: string): Promise<{ checkoutUrl: string }> => {
    const { data } = await axiosInstance.post<ApiResponse<{ checkoutUrl: string }>>(
      API_ROUTES.OWNER.CREATE_CHECKOUT_SESSION,
      { priceId }
    )
    return data.data
  },
}
