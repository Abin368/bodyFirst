import axiosInstance from './axiosInstance'
import type { IMemberProfile } from '@/types/member'
import { API_ROUTES } from '@/constants/apiRoutes'
import type { ApiResponse } from '@/types/member'
import type { MemberProfileFormValues } from '@/schemas/member'

export const MemberService = {
  getMemberProfile: async (): Promise<IMemberProfile> => {
    const { data } = await axiosInstance.get<ApiResponse<IMemberProfile>>(
      API_ROUTES.MEMBER.PROFILE_ME
    )

    return data.data
  },
  //-----------------------------------------------------
  finalizeProfileSetup: async (
    payload: MemberProfileFormValues & { tempImageKey?: string }
  ): Promise<{ profile: IMemberProfile; message: string }> => {
    const response = await axiosInstance.post<ApiResponse<IMemberProfile>>(
      API_ROUTES.MEMBER.FINALIZE_GYM,
      payload
    )

    return {
      profile: response.data.data,
      message: response.data.message,
    }
  },

  //-----------------------------------------------------------------
  uploadProfileImage: async (formData: FormData): Promise<{ key: string; url: string }> => {
    const { data } = await axiosInstance.post(API_ROUTES.MEMBER.UPLOAD_IMG, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
