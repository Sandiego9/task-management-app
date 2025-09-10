import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { AuthenticatedUser, DecodedToken } from "@/types/user";

const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;

interface State {
  user: AuthenticatedUser | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    user: null,
    token: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // LOGIN
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const { data } = await axios.post(`${baseUrl}/authentication/login`, {
          email,
          password,
        });

        const token = data.token;
        this.setTokenAndUser(token);

        return { success: true };
      } catch (error: any) {
        return { success: false, errorMessage: error?.response?.data?.message || "Login failed" };
      } finally {
        this.isLoading = false;
      }
    },

    // REGISTER
    async register(payload: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      password: string;
      isAdmin: boolean;
    }) {
      this.isLoading = true;
      try {
        const { data } = await axios.post(`${baseUrl}/authentication/signup`, payload);

        const token = data.token;
        this.setTokenAndUser(token);

        return { success: true };
      } catch (error: any) {
        return { success: false, errorMessage: error?.response?.data?.message || "Registration failed" };
      } finally {
        this.isLoading = false;
      }
    },

    // RESET PASSWORD (request link)
    async requestPasswordReset(email: string) {
      try {
        await axios.post(`${baseUrl}/authentication/password-reset`, { email });
        return { success: true };
      } catch {
        return { success: false, errorMessage: "Failed to send reset email" };
      }
    },

    // CONFIRM RESET PASSWORD (with token)
    async confirmPasswordReset(payload: { token: string; newPassword: string }) {
      try {
        await axios.post(`${baseUrl}/authentication/password-reset/confirm`, payload);
        return { success: true };
      } catch {
        return { success: false, errorMessage: "Failed to reset password" };
      }
    },

    // CHANGE PASSWORD (when logged in)
    async changePassword(payload: { oldPassword: string; newPassword: string }) {
      try {
        await axios.post(`${baseUrl}/authentication/change-password`, {
          userId: this.user?.id,
          ...payload,
        });
        return { success: true };
      } catch {
        return { success: false, errorMessage: "Failed to change password" };
      }
    },

    // LOGOUT
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    },

    setTokenAndUser(token: string) {
      this.token = token;
      localStorage.setItem("auth_token", token);

      const decoded = jwtDecode<DecodedToken>(token);
      this.user = {
        id: decoded._id,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        fullName: decoded.fullName || "User",
        profileImage: decoded.profileImage || "",
      };

      localStorage.setItem("user", JSON.stringify(this.user));
    },

    init() {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        this.token = token;
        this.user = JSON.parse(storedUser);
      }
    },
  },
});
