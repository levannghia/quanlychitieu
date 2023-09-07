import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    email: null,
    user_metadata: null
  }),
  getters: {

  },
  actions: {
    async setUserDetail(res) {
      this.id = res.id
      this.email = res.email
      this.user_metadata = res.user_metadata
    },
  },
});
