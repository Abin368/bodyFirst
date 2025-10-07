import { makeAutoObservable, runInAction } from 'mobx'
import type { IOwnerGym } from '@/types/owner'
import { GymService } from '@/services/gymServices'
import { authStore } from './authStore'

class GymStore {
  gyms: IOwnerGym[] = []
  loading = false
  error: string | null = null
  private fetching = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchGyms() {
    if (!authStore.isAuthenticated) return
    if (this.fetching) return

    this.fetching = true
    this.loading = true
    this.error = null

    try {
      const gyms = await GymService.getGyms()
      runInAction(() => {
        this.gyms = gyms
      })
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch gyms'
      })
      throw err
    } finally {
      runInAction(() => {
        this.loading = false
        this.fetching = false
      })
    }
  }
}

export const gymStore = new GymStore()
