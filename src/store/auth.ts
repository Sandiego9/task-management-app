import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { email: string },
    token: '',
  }),
  actions: {
    login(user: { email: string }, token: string) {
      this.user = user;
      this.token = token;
    },
    logout() {
      this.user = null;
      this.token = '';
    },
  },
});
