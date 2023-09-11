<template>
  <q-page padding>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Overline</div>
          <div>
            <Doughnut :data="data" :options="options"></Doughnut>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { onUnmounted, onMounted, ref, watch } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import useAuthUser from "src/composables/useAuthUser"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
// import * as chartConfig from './chartConfig.js'
import useSupabase from 'src/boot/supabase'

ChartJS.register(ArcElement, Tooltip, Legend)
const { supabase } = useSupabase()
const categoryStore = useCategoryStore()
const { fetchListData, removeById } = useApi();
const { notifyError, notifySuccess } = useNotify();
const data = ref({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})

onMounted(() => {
  categoryStore.bcrumb = 'Biểu đồ'
})

onUnmounted(() => {
  categoryStore.bcrumb = ''
})
</script>

<style></style>
