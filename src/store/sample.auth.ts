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
    async registerUser(payload: AuthenticatedUser) {
      this.isLoading = true;
      try {
        const { data } = await axios.post(`${baseUrl}/Users`, payload);

        if (!data?.isSuccessful) {
          throw new Error(
            data?.errors?.join(", ") || "User registration failed"
          );
        }

        const userId = data.data;

        this.user = {
          id: userId,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          fullName: `${payload.firstName} ${payload.lastName}`,
          jobTitle: payload.jobTitle,
          accountType: payload.accountType,
        };

        localStorage.setItem("user", JSON.stringify(this.user));

        return { success: true, userId };
      } catch (err: any) {
        return {
          success: false,
          errorMessage: err?.message || "User registration failed.",
        };
      } finally {
        this.isLoading = false;
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const { data } = await axios.post(`${baseUrl}/authentication/login`, {
          email,
          password,
        });

        if (!data?.isSuccessful || !data?.data) {
          throw new Error(data?.errors?.join(", ") || "Login failed.");
        }

        const userData = data.data;

        // Build user object
        this.user = {
          id: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          jobTitle: userData.jobTitle || "", // may be undefined from API
          accountType: userData.accountType,
        };

        this.token = userData.accessToken;

        // Persist to localStorage
        localStorage.setItem("auth_token", this.token ?? "");
        localStorage.setItem("user", JSON.stringify(this.user));

        await this.setTokenAndUser(this.token!, this.user);

        return { success: true };
      } catch (err: any) {
        const errorMessage = err?.message || "Login failed.";
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
        if (!this.user?.id)
          throw new Error("User not found or not authenticated.");

        await axios.post(`${baseUrl}/auth/change-password`, {
          userId: this.user.id,
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
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
        const userId = decodedToken.sub;
        const role =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        let existingUser = await userServices.fetchUser(userId);

        if (!existingUser) {
          const newUser: AuthenticatedUser = {
            id: userId,
            email: additionalUserData?.email || decodedToken.email,
            firstName: additionalUserData?.firstName || "",
            lastName: additionalUserData?.lastName || "",
            fullName: additionalUserData?.fullName || "",
            jobTitle: additionalUserData?.jobTitle || "",
            accountType: additionalUserData?.accountType || role || "User",
          };

          existingUser = await userServices.createUser(newUser);
        }

        this.user = existingUser;
        localStorage.setItem("user", JSON.stringify(existingUser));
      } catch (error) {
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
