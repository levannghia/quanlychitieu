<template>
  <q-page padding>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Thu nhập</div>
          <div>
            <Doughnut
              v-if="loaded"
              :data="dataChart"
              :options="options"
            ></Doughnut>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card class="my-card q-mt-lg" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Chi tiêu</div>
          <div>
            <Doughnut
              v-if="loaded"
              :data="dataChartChi"
              :options="options"
            ></Doughnut>
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
import useAuthUser from "src/composables/useAuthUser";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import useSupabase from "src/boot/supabase";

ChartJS.register(ArcElement, Tooltip, Legend);

const { supabase } = useSupabase();
const categoryStore = useCategoryStore();
const { user } = useAuthUser();
const { generateRandomColorArray } = useApi();
const { notifyError, notifySuccess } = useNotify();
const loaded = ref(false);
const listCategoryId = ref([]);
const listCategoryAll = ref([]);
const colorArr = ref([]);
const dataChart = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
});

const dataChartChi = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const handleGetTotalByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from("total_by_category")
      .select()
      .eq("userId", user.value.id)
      .order("categoryId", { ascending: false });
    if (error) throw error;
    data.forEach((item) => {
      listCategoryId.value.push(item.categoryId);
    });
    listCategoryAll.value = data;
    await handleFilterCategory();
    return data;
  } catch (error) {
    notifyError(error.message);
  }
};

const handleFilterCategory = async () => {
  loaded.value = false;
  let count = 0;
  let count2 = 0;
  try {
    const { data, error } = await supabase
      .from("categories")
      .select()
      .in("id", listCategoryId.value)
      .order("id", { ascending: false });
    if (error) throw error;
    data.forEach((item) => {
      if (item.type === true) {
        count++;
        const currentItem = item;
        listCategoryAll.value.forEach((category) => {
          if (category.categoryId == currentItem.id) {
            dataChart.value.datasets[0].data.push(category.total_price);
          }
        });

        colorArr.value = generateRandomColorArray(count);
        dataChart.value.datasets[0].backgroundColor = colorArr.value;
        dataChart.value.labels.push(item.name);
      } else {
        count2++;
        const currentItem2 = item;
        listCategoryAll.value.forEach((category) => {
          if (category.categoryId == currentItem2.id) {
            dataChartChi.value.datasets[0].data.push(category.total_price);
          }
        });

        colorArr.value = generateRandomColorArray(count);
        dataChartChi.value.datasets[0].backgroundColor = colorArr.value;
        dataChartChi.value.labels.push(item.name);
      }
    });

    return data;
  } catch (error) {
    notifyError(error.message);
  } finally {
    loaded.value = true;
  }
};

onMounted(() => {
  categoryStore.bcrumb = "Biểu đồ";
  handleGetTotalByCategory();
});

onUnmounted(() => {
  categoryStore.bcrumb = "";
});
</script>

<style></style>
