import { makeAutoObservable } from "mobx";

class AuthStore {
  accessToken: string | null = null;
  role: string | null = null;
  userId: string | null = null;

  constructor() {
    makeAutoObservable(this);

    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      const { accessToken, role, userId } = JSON.parse(savedAuth);
      this.accessToken = accessToken;
      this.role = role;
      this.userId = userId;
    }
  }

  setAuth(token: string, role: string, userId: string) {
    this.accessToken = token;
    this.role = role;
    this.userId = userId;
    localStorage.setItem(
      "auth",
      JSON.stringify({ accessToken: token, role, userId })
    );
  }

  clearAuth() {
    this.accessToken = null;
    this.role = null;
    this.userId = null;
    localStorage.removeItem("auth");
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }
}

export const authStore = new AuthStore();
