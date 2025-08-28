import { makeAutoObservable } from "mobx";
import { refreshAccessToken } from "@/services/authService";

class AuthStore {
  accessToken: string | null = null;
  role: string | null = null;
  userId: string | null = null;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.restoreSession();
  }

  async restoreSession() {
    if (this.isAuthenticated) return;
    this.isLoading = true;
    try {
      const data = await refreshAccessToken();
      if (!data.accessToken || !data.role || !data.userId) {
        throw new Error("Invalid refresh response");
      }
      this.setAuth(data.accessToken, data.role, data.userId);
    } catch (error) {
     
      this.clearAuth();
    } finally {
      this.isLoading = false;
    }
  }

  setAuth(token: string, role: string, userId: string) {
    this.accessToken = token;
    this.role = role;
    this.userId = userId;
  }

  clearAuth() {
    this.accessToken = null;
    this.role = null;
    this.userId = null;
  }

  get isAuthenticated() {
    return !!this.accessToken && !!this.role && !!this.userId;
  }
}

export const authStore = new AuthStore();