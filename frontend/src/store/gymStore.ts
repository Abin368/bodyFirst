import { makeAutoObservable, runInAction } from 'mobx'
import type { IOwnerGym } from '@/types/owner'
import { GymService } from '@/services/gymServices'

class GymStore {
  gyms: IOwnerGym[] = []
  loading = false
  error: string | null = null

  searchTerm = ''
  page = 1
  limit = 12

  totalPages = 1

  cache = new Map<string, IOwnerGym[]>()

  constructor() {
    makeAutoObservable(this)
  }

  setSearch(term: string) {
    this.searchTerm = term
    this.page = 1
  }
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return
    this.page = page
  }

  private getCacheKey() {
    return `${this.searchTerm}|${this.page}`
  }

  async fetchGyms() {
    const cacheKey = this.getCacheKey()
    if (this.cache.has(cacheKey)) {
      runInAction(() => {
        this.gyms = this.cache.get(cacheKey)!
      })
      return
    }

    this.loading = true
    this.error = null

    try {
      const response = await GymService.getGyms({
        page: this.page,
        limit: this.limit,
        search: this.searchTerm.trim(),
      })

      runInAction(() => {
        this.gyms = response.gyms
        this.totalPages = response.totalPages || 1
        this.page = response.currentPage
        this.cache.set(cacheKey, response.gyms)
      })
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch gyms'
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}

export const gymStore = new GymStore()
