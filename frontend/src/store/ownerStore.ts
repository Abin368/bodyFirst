import { makeAutoObservable, runInAction } from 'mobx'
import { OwnerService } from '@/services/ownerService'
import type { IOwnerGym, IOwnerProfile } from '@/types/owner'
import { authStore } from './authStore'
import type { GymFormValues } from '@/schemas/gym'

class OwnerStore {
  gym: IOwnerGym | null = null
  profile: IOwnerProfile | null = null
  loading = false
  error: string | null = null
  private fetching = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchProfile() {
    if (!authStore.isAuthenticated) return
    if (this.fetching) return
    this.fetching = true
    this.loading = true
    this.error = null

    try {
      const profile = await OwnerService.getProfile()
      runInAction(() => {
        this.profile = profile
      })
    } catch (err: any) {
      runInAction(() => {
        if (err.response?.status === 404) {
          this.profile = { subscriptionStatus: 'INACTIVE' } as IOwnerProfile
          this.error = null
        } else {
          this.error = err.response?.data?.message || err.message || 'Failed to fetch owner profile'
        }
      })
    } finally {
      runInAction(() => {
        this.loading = false
        this.fetching = false
      })
    }
  }
  //-------------------------------------
  async createGym(payload: GymFormValues & { tempImageKey?: string }) {
    this.loading = true
    this.error = null
    try {
      const { gym, profile } = await OwnerService.finalizeGymSetup(payload)

      runInAction(() => {
        this.gym = gym
        this.profile = profile
      })
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

  get subscriptionStatus(): 'ACTIVE' | 'INACTIVE' | 'EXPIRED' {
    return this.profile?.subscriptionStatus || 'INACTIVE'
  }

  get isSubscribed(): boolean {
    return this.subscriptionStatus === 'ACTIVE'
  }

  get hasGym(): boolean {
    return !!this.profile?.gymId
  }

  get dashboardState(): 'NO_GYM' | 'NO_SUBSCRIPTION' | 'ACTIVE' {
    if (!this.hasGym) return 'NO_GYM'
    if (this.hasGym && !this.isSubscribed) return 'NO_SUBSCRIPTION'
    return 'ACTIVE'
  }

  updateProfile(profile: IOwnerProfile) {
    this.profile = profile
  }

  clearStore() {
    this.gym = null
    this.profile = null
    this.error = null
    this.loading = false
  }
}

export const ownerStore = new OwnerStore()
