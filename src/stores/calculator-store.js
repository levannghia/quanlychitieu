import { defineStore } from 'pinia';

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    calculation: "",
    tempResult: "",
  }),
});
