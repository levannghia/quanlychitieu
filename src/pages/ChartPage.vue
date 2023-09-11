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
import useAuthUser from "src/composables/useAuthUser";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
// import * as chartConfig from './chartConfig.js'
import useSupabase from "src/boot/supabase";

ChartJS.register(ArcElement, Tooltip, Legend);
const { supabase } = useSupabase();
const { user } = useAuthUser();
const categoryStore = useCategoryStore();
const { fetchListData, removeById } = useApi();
const { notifyError, notifySuccess } = useNotify();
const dataCategory = ref([]);
const data = ref({
  labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: [40, 20, 80, 10],
    },
  ],
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});
const categoryIdColumn = 'categoryId'; // Thay thế bằng tên cột categoryId của bạn
const priceColumn = 'price';

const calculateTotalPriceByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from("notes")
       .rpc('calculate_total_price_by_category', { categoryIdColumn, priceColumn });
    if (error) throw error;
    console.log("Tổng giá theo categoryId:", data);
    return data;
  } catch (error) {
    notifyError(error.message);
  }
};

// calculateTotalPriceByCategory()

onMounted(() => {
  categoryStore.bcrumb = "Biểu đồ";
});

onUnmounted(() => {
  categoryStore.bcrumb = "";
});
</script>

<style></style>
