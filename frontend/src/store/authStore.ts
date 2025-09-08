import { makeAutoObservable } from 'mobx'
import { refreshAccessToken } from '@/services/authService'
import { googleLogin } from '@/services/authService'

class AuthStore {
  accessToken: string | null = null
  role: string | null = null
  userId: string | null = null
  isLoading: boolean = false

  constructor() {
    makeAutoObservable(this)
    this.restoreSession()
  }

  async restoreSession() {
    if (this.isAuthenticated) return
    this.isLoading = true
    try {
      const data = await refreshAccessToken()
      if (!data.accessToken || !data.role || !data.userId) {
        throw new Error('Invalid refresh response')
      }
      this.setAuth(data.accessToken, data.role, data.userId)
    } catch (error) {
      this.clearAuth()
    } finally {
      this.isLoading = false
    }
  }

  setAuth(token: string, role: string, userId: string) {
    this.accessToken = token
    this.role = role
    this.userId = userId
  }

  clearAuth() {
    this.accessToken = null
    this.role = null
    this.userId = null
  }

  async loginWithGoogle(idToken: string, role: string) {
    this.isLoading = true
    try {
      const { accessToken, role: userRole, userId } = await googleLogin(idToken, role)
      this.setAuth(accessToken, userRole, userId)
    } catch (error) {
      this.clearAuth()
      throw error
    } finally {
      this.isLoading = false
    }
  }

  get isAuthenticated() {
    return !!this.accessToken && !!this.role && !!this.userId
  }
}

export const authStore = new AuthStore()
