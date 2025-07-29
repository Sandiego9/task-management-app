import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import type { AuthenticatedUser } from "../types/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthenticatedUser | null,
    token: "" as string | null,
    isLoading: true as boolean,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {
    setUser(firebaseUser: User) {
      this.user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      };

      // Get the token
      try {
        this.token = await firebaseUser.getIdToken();
      } catch (error) {
        console.error("Token fetch failed:", error);
        this.token = null;
      } finally {
        this.isLoading = false;
      }
    },
    clearUser() {
      this.user = null;
      this.token = null;
      this.isLoading = false;
    },
    init() {
      const auth = getAuth();
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          this.setUser(firebaseUser);
        } else {
          this.clearUser();
        }
        this.isLoading = false;
      });
    },
  },
});
