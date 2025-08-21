import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, AuthenticatedUser } from "../types/user";
import axios from "axios";

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
          password
        });

        const token = response.data.token;
        this.setTokenAndUser(token, {
          email,
          displayName: "User"
        });

        return { success: true };
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Login failed.";

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

        const displayName = `${payload.firstName} ${payload.lastName}`;
        this.setTokenAndUser(token, {
          email: payload.email,
          displayName
        });

        return { success: true };
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Registration failed.";

        return { success: false, errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    setTokenAndUser(token: string, additionalUserData?: Partial<AuthenticatedUser>) {
      this.token = token;
      localStorage.setItem("auth_token", token);

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        this.user = {
          uid: decodedToken._id,
          isAdmin: decodedToken.isAdmin,
          email: additionalUserData?.email || null,
          displayName: additionalUserData?.displayName || "User"
        };

        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error: any) {
        console.error("Failed to decode token", error);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    },

    init() {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          this.token = token;

          const baseUser = {
            uid: decodedToken._id,
            isAdmin: decodedToken.isAdmin
          }

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            this.user = {
              ...baseUser,
              email: parsedUser.email,
              displayName: parsedUser.displayName
            };
          } else {
            this.user = {
              ...baseUser,
              email: null,
              displayName: "User"
            };
          }
        } catch (error: any) {
          console.error("Failed to decode token on initialization", error);
          this.logout();
        }
      }
      this.isLoading = false;
    },
  },
});
