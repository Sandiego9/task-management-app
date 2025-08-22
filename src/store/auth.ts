import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, AuthenticatedUser } from "../types/user";
import axios from "axios";
import userServices from "@/services/userServices";

const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthenticatedUser | null,
    token: "" as string | null,
    isLoading: false as boolean,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const response = await axios.post(`${baseUrl}/auth/login`, {
          email,
          password,
        });

        const token = response.data.token;
        await this.setTokenAndUser(token, { email });

        return { success: true };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Login failed.";
        return { success: false, errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

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
        const response = await axios.post(`${baseUrl}/auth/signup`, payload);
        const token = response.data.token;

        await this.setTokenAndUser(token, {
          email: payload.email,
          fullName: `${payload.firstName} ${payload.lastName}`,
        });

        return { success: true };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Registration failed.";
        return { success: false, errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    async changePassword(payload: {
      currentPassword: string;
      newPassword: string;
    }) {
      this.isLoading = true;
      try {
        if (!this.user?.id) throw new Error("User not found or not authenticated.");

        await axios.post(`${baseUrl}/auth/change-password`, {
          userId: this.user.id,
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword
        });

        return { success: true };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Password change failed.";
        return { success: false, errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    async setTokenAndUser(
      token: string,
      additionalUserData?: Partial<AuthenticatedUser>
    ) {
      this.token = token;
      localStorage.setItem("auth_token", token);

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken._id;

        let existingUser = await userServices.fetchUser(userId);

        if (!existingUser) {
          const newUser: AuthenticatedUser = {
            id: userId,
            email: additionalUserData?.email || "",
            fullName: additionalUserData?.fullName || "User",
            profileImage: additionalUserData?.profileImage || "",
            phoneNumber: "",
            bio: "",
            location: "",
            portfolio: "",
            isAdmin: decodedToken.isAdmin,
          };

          existingUser = await userServices.createUser(newUser);
        }

        this.user = existingUser;
        localStorage.setItem("user", JSON.stringify(existingUser));
      } catch (error: any) {
        console.error("Failed to set token and user", error);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    },

    async init() {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        this.isLoading = false;
        return;
      }

      this.token = token;
      try {
        await this.setTokenAndUser(token);
      } catch (error: any) {
        console.error("Failed to init auth store", error);
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },
  },
});
