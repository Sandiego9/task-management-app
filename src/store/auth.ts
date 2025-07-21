import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

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
      firebaseUser.getIdToken().then((token: string) => {
        this.token = token;
        this.isLoading = false;
      });
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
