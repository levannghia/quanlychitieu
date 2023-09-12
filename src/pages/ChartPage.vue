<template>
  <q-page padding>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Overline</div>
          <div>
            <Doughnut v-if="loaded" :data="dataChart" :options="options"></Doughnut>
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
const { user } = useAuthUser()
const { fetchListData, removeById } = useApi();
const { notifyError, notifySuccess } = useNotify();
const loaded = ref(false)
const listCategoryId = ref([])
const dataChart = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [10, 20, 30, 40]
    }
  ]
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})

const handleGetTotalByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from("total_by_category")
      .select()
      .eq("userId", user.value.id)
      .order("categoryId", { ascending: false });
    if (error) throw error;
    data.forEach(item => {
      dataChart.value.datasets[0].data.push(item.total_price);
      listCategoryId.value.push(item.categoryId);
    });
    await handleFilterCategory();

    return data;
  } catch (error) {
    notifyError(error.message);
  }
};

const handleFilterCategory = async () => {
  loaded.value = false
  try {
    const { data, error } = await supabase
      .from('categories')
      .select()
      .in('id', listCategoryId.value);
    if (error) throw error;
    data.forEach(item => {
      dataChart.value.labels.push(item.name)
    });

    // return data
  } catch (error) {
    notifyError(error.message)
  } finally{
    loaded.value = true
  }
}



onMounted(() => {
  categoryStore.bcrumb = 'Biểu đồ'
handleGetTotalByCategory();
})

onUnmounted(() => {
  categoryStore.bcrumb = ''
})
</script>

<style></style>
