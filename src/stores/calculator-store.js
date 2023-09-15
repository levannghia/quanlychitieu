import { defineStore } from 'pinia';

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    calculation: "",
    tempResult: "",
  }),

  actions: {
    deleteCal(){
      if(this.calculation.length > 0){
         this.calculation = this.calculation.substring(0, this.calculation.length - 1);
      }else{
        this.tempResult = "";
      }
    }
  }
});
