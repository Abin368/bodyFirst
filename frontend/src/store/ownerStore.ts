import { makeAutoObservable, runInAction } from 'mobx'
import { OwnerService } from '@/services/ownerService'

import type { OwnerProfile } from '@/types/owner'
import { authStore } from './authStore'

class OwnerStore {
  profile: OwnerProfile | null = null
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
          this.profile = { subscriptionStatus: 'INACTIVE' } as OwnerProfile
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

  get subscriptionStatus(): 'ACTIVE' | 'INACTIVE' | 'EXPIRED' {
    return this.profile?.subscriptionStatus || 'INACTIVE'
  }

  get isSubscribed(): boolean {
    return this.subscriptionStatus === 'ACTIVE'
  }

  updateProfile(profile: OwnerProfile) {
    this.profile = profile
  }

  clearStore() {
    this.profile = null
    this.error = null
    this.loading = false
  }
}

export const ownerStore = new OwnerStore()
