<template>
  <div id="app_cal" v-cloak>
    <div id="calculator">
      <!-- <div class="screen-container">
        <div class="result">
          <transition name="slide-fade">
            <div
              class="number"
              :style="{ fontSize: fontSize + 'px' }"
              v-if=" calculatorStore.tempResult !== ''"
              v-cloak
            >
              {{ calculatorStore.tempResult }}
            </div>
          </transition>
        </div>
        <div class="calculation">
          <div class="number" v-cloak>
            {{ repCalculation }}
          </div>
        </div>
      </div> -->
      <div class="btn-container">
        <!-- <div class="oper-container">
          <div class="btn" id="clear" @click="clear()">
            <div class="number">AC</div>
          </div>
          <div class="btn operations divide" @click="append('/')">
            <div class="number">÷</div>
          </div>
          <div class="btn operations multiplication" @click="append('*')">
            <div class="number">×</div>
          </div>
          <div class="btn operations plus" @click="append('+')">
            <div class="number">+</div>
          </div>
          <div class="btn operations less" @click="append('-')">
            <div class="number">-</div>
          </div>
        </div> -->
        <div class="row">
          <div class="btn" @click="append('/')">
            <div class="number">÷</div>
          </div>
          <div class="btn" @click="append('*')">
            <div class="number">×</div>
          </div>
          <div class="btn" @click="append('+')">
            <div class="number">+</div>
          </div>
          <div class="btn" @click="append('-')">
            <div class="number">-</div>
          </div>
          <div class="btn" @click="deleteStr()">
            <div class="number"><q-icon name="backspace" /></div>
          </div>
        </div>
        <div class="row">
          <div class="btn" @click="append('7')">
            <div class="number">7</div>
          </div>
          <div class="btn" @click="append('8')">
            <div class="number">8</div>
          </div>
          <div class="btn" @click="append('9')">
            <div class="number">9</div>
          </div>
          <!-- 				<div class="btn" @click="append('/')">÷</div> -->
        </div>
        <div class="row">
          <div class="btn" @click="append('4')">
            <div class="number">4</div>
          </div>
          <div class="btn" @click="append('5')">
            <div class="number">5</div>
          </div>
          <div class="btn" @click="append('6')">
            <div class="number">6</div>
          </div>
          <!-- 				<div class="btn" @click="append('*')">×</div> -->
        </div>
        <div class="row">
          <div class="btn" @click="append('1')">
            <div class="number">1</div>
          </div>
          <div class="btn" @click="append('2')">
            <div class="number">2</div>
          </div>
          <div class="btn" @click="append('3')">
            <div class="number">3</div>
          </div>
          <!-- 				<div class="btn" @click="append('-')">-</div> -->
        </div>
        <div class="row">
          <div class="btn" id="dot" @click="clear()">
            <div class="number">AC</div>
          </div>
          <!-- <div class="btn" id="dot" @click="append('.')">
            <div class="number">.</div>
          </div> -->
          <div class="btn" @click="append('0')">
            <div class="number">0</div>
          </div>
          <div class="btn">
            <div class="number"></div>
          </div>
          <div class="btn" id="result" @click="getResult()">
            <div class="number">=</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useCalculatorStore } from "src/stores/calculator-store";

// const emit = defineEmits(['saveNotes'])

const calculatorStore = useCalculatorStore();

// function saveNotes() {
//   emit('saveNotes')
// }

function append(value) {
  calculatorStore.calculation += value.toString();
}

function getResult() {
  if (calculatorStore.tempResult != "") {
    calculatorStore.calculation = calculatorStore.tempResult;
    //this.tempResult = ''
  }
}

function deleteStr() {

  calculatorStore.deleteCal();

// console.log(chuoi);
}

function clear() {
  calculatorStore.calculation = "";
  calculatorStore.tempResult = "";
}

function backspace() {
  calculatorStore.calculation = calculatorStore.calculation.slice(0, -1);
}
onMounted(() => {
  let btns = document.querySelectorAll(".btn");
  for (let btn of btns) {
    btn.addEventListener("click", function () {
      this.classList.add("animate");
      this.classList.add("resetappearanim");
    });
    btn.addEventListener("animationend", function () {
      this.classList.remove("animate");
    });
  }
});

const result = computed(() => {
  if (!isNaN(calculatorStore.calculation.slice(-1))) return eval(calculatorStore.calculation);
  else return eval(calculatorStore.calculation.slice(0, -1));
});

const fontSize = computed(() => {
  return 50 - calculatorStore.tempResult.length * 1.25;
});

// const hugeNumber = computed(() => {
//   let parts = calculatorStore.calculation.toString().split(".");
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
//   return parts.join(".");
// });

const repCalculation = computed(() => {
  return calculatorStore.calculation
    .replaceAll("*", "x")
    .replaceAll("x", " x ")
    .replaceAll("/", " / ")
    .replaceAll("+", " + ")
    .replaceAll("-", " - ");
});

watchEffect(() => {
  if (
    calculatorStore.calculation !== "" &&
    !isNaN(calculatorStore.calculation.slice(-1)) &&
    calculatorStore.calculation != result
  ) {
    calculatorStore.tempResult = result.value.toString();
  }
});


</script>

<style scoped>
* {
  box-sizing: border-box;
}

#app_cal {
  width: 100%;
  height: 100%;
  display: flex;
  font-family: "Roboto", sans-serif;
  /* font-weight: 300; */
  font-size: 24px;
}
#app_cal #calculator {
  opacity: 0;
  -webkit-animation: 1s bounceIn;
  animation: 1s bounceIn;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  margin: 10px;
  border-radius: 8px;
  color: #ffffff;
  box-shadow: 10px 10px 50px rgba(0, 0, 0, 0.5);
  margin: auto;
  height: 300px;
  width: 100%;
  background: #191b1d;
}
#app_cal #calculator .screen-container {
  width: 100%;
  height: 38%;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  text-align: right;
}
#app_cal #calculator .screen-container .calculation,
#app_cal #calculator .screen-container .result {
  width: 100%;
  height: 50%;
  padding-right: 15px;
}
#app_cal #calculator .screen-container .result {
  display: flex;
  align-items: flex-end;
  color: var(--q-primary);
  justify-content: flex-end;
}
#app_cal #calculator .screen-container .result .number {
  font-size: 50px;
  font-weight: 800;
}
#app_cal #calculator .btn-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
#app_cal #calculator .btn-container .oper-container {
  z-index: 10;
  opacity: 0;
  -webkit-animation: 1s bounceIn;
  animation: 1s bounceIn;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  position: absolute;
  width: 50px;
  left: -60px;
  box-shadow: 10px 10px 50px rgba(0, 0, 0, 0.5);
  top: 0px;
}
#app_cal #calculator .btn-container .oper-container .btn {
  position: static;
  width: 50px;
  height: 50px;
  background: var(--q-primary);
  color: var(--q-primary);
  background: #ffffff;
  display: flex;
  cursor: pointer;
}
#app_cal #calculator .btn-container .oper-container .btn .number {
  margin: auto;
}
#app_cal #calculator .btn-container .oper-container .btn#clear.animate {
  -webkit-animation: fade 0.12s ease-in-out;
  animation: fade 0.12s ease-in-out;
  animation-direction: reverse;
}
#app_cal #calculator .btn-container .oper-container .btn#clear {
  cursor: pointer;
  height: 50px;
  width: 50px;
  display: flex;
  background: #1e2022;
  border-radius: 8px 0px 0 0;
  font-size: 16px;
  box-shadow: 10px 10px 50px rgba(0, 0, 0, 0.5);
}
#app_cal #calculator .btn-container .oper-container .btn#clear .number {
  margin: auto;
  color: #ffffff;
}
#app_cal #calculator .btn-container .row {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 25%;
  flex-wrap: nowrap !important;
}
#app_cal #calculator .btn-container .row .btn {
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  border: 0.5px solid #191b1d;
  background: #1e2022;
}
#app_cal #calculator .btn-container .row .btn .number {
  opacity: 0;
  -webkit-animation: 1s fadeIn;
  animation: 1s fadeIn;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  margin: auto;
}
#app_cal #calculator .btn-container .row .btn:nth-child(1) {
  border-left: none;
}
#app_cal #calculator .btn-container .row .btn:nth-child(3) {
  border-right: none;
}
#app_cal #calculator .btn-container .row .btn.animate {
  -webkit-animation: fade 0.12s ease-in-out;
  animation: fade 0.12s ease-in-out;
}
#app_cal #calculator .btn-container .row .btn#result {
  position: absolute;
  right: -12px;
  bottom: -12px;
  width: calc(33% * 1.25);
  height: calc(100% * 1.25);
  background: var(--q-primary);
  border-bottom-right-radius: 8px;
  border: 0.5px rgba(0, 0, 0, 0.0001);
}
#app_cal #calculator .btn-container .row .btn#result:not(.resetappearanim) {
  opacity: 0;
  -webkit-animation: 1s bounceIn;
  animation: 1s bounceIn;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
#app_cal #calculator .btn-container .row .btn#result.animate {
  -webkit-animation: fade 0.12s ease-in-out;
  animation: fade 0.12s ease-in-out;
  animation-direction: reverse;
}
#app_cal #calculator .btn-container .row .btn#dot {
  border-bottom-left-radius: 8px;
}
#app_cal #calculator .btn-container .row:last-child .btn {
  border-bottom: none;
}
#app_cal #calculator .btn-container .btn.operations.animate {
  -webkit-animation: fadeThird 0.12s ease-in-out;
  animation: fadeThird 0.12s ease-in-out;
  animation-direction: reverse;
}
#app_cal #calculator .btn-container .btn.operations.divide {
  left: calc(33% - 25px);
  top: calc(25% - 25px);
}
#app_cal #calculator .btn-container .btn.operations.multiplication {
  left: calc(66% - 25px);
  top: calc(25% - 25px);
}
#app_cal #calculator .btn-container .btn.operations.plus {
  left: calc(66% - 25px);
  top: calc(50% - 25px);
}
#app_cal #calculator .btn-container .btn.operations.less {
  left: calc(33% - 25px);
  top: calc(50% - 25px);
  border-radius: 0 0 8px 0;
}

@-webkit-keyframes fade {
  from {
    background: #1e2022;
  }
  to {
    background: var(--q-primary);
  }
}

@keyframes fade {
  from {
    background: #1e2022;
  }
  to {
    background: var(--q-primary);
  }
}
@-webkit-keyframes fadeThird {
  from {
    background: #ffffff;
  }
  to {
    background: #1e2022;
  }
}
@keyframes fadeThird {
  from {
    background: #ffffff;
  }
  to {
    background: #1e2022;
  }
}
@-webkit-keyframes bounceIn {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
@keyframes bounceIn {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
@-webkit-keyframes bounce {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
@keyframes bounce {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

*:focus {
  outline: none;
}

@media screen and (max-width: 500px) {
  #app_cal {
    transform: scale(0.9) translateY(0%);
  }
}
*::-moz-selection {
  background: var(--q-primary);
  color: #ffffff;
}
*::selection {
  background: var(--q-primary);
  color: #ffffff;
}

[v-cloak] {
  display: none;
}
</style>
