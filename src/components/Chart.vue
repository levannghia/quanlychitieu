<template>
  <Doughnut :data="data" :options="options"></Doughnut>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Object,
  }
})

const { data } = toRefs(props)

console.log(data.value);

// const dataChart = ref({
//   labels: label,
//   datasets: [
//     {
//       backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
//       data: [10,20,30,40]
//     }
//   ]
// })

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})
</script>
