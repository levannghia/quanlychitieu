import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    type: true,
    bcrumb: '',
    selectedCategory: {
      name: '',
      type: null
    } 
  }),
  getters: {
  
  },
  actions: {
   
  },
});