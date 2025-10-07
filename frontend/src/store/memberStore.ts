import { makeAutoObservable, runInAction } from 'mobx'
import type { IMemberProfile } from '@/types/member'
import { authStore } from './authStore'
import { MemberService } from '@/services/memberService'
import type { MemberProfileFormValues } from '@/schemas/member'

class MemeberStore {
  profile: IMemberProfile | null = null
  loading = false
  error: string | null = null
  private fetching = false

  constructor() {
    makeAutoObservable(this)
  }
  //--------------------------------------------------
  async createProfile(
    payload: MemberProfileFormValues & { tempImageKey?: string }
  ): Promise<{ profile: IMemberProfile; message: string }> {
    this.loading = true
    this.error = null
    try {
      const { profile, message } = await MemberService.finalizeProfileSetup(payload)

      runInAction(() => {
        this.profile = profile
      })

      return { profile, message }
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'Failed to create gym'
      })
      throw err
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  //-----------------------------------------------

  async fetchMemberProfile() {
    if (!authStore.isAuthenticated) return
    if (this.fetching) return

    this.fetching = true
    this.loading = true
    this.error = null

    try {
      const profile = await MemberService.getMemberProfile()

      runInAction(() => {
        this.profile = profile
      })
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch profile'
      })
    } finally {
      runInAction(() => {
        this.loading = false
        this.fetching = false
      })
    }
  }

  //-------------------------------------------

  get memberView(): 'create' | 'listGyms' | 'dashboard' {
    if (!this.profile) return 'create'
    if (this.profile.status === 'PENDING') return 'listGyms'
    if (this.profile.status === 'ACTIVE') return 'dashboard'
    return 'create' // fallback
  }
}
//------------------------------------------

export const memberStore = new MemeberStore()
