<template>
  <q-page>
    <div class="bg-primary" id="custom-money-note">
      <div class="text-white box-shadow q-pa-md row justify-between items-center">
        <div class="text-left">
          <q-btn :icon="selectedCategory.type ? 'monetization_on' : 'credit_card_off'" round
            :color="selectedCategory.type ? 'positive' : 'warning'" @click="handleDialog"></q-btn>
          <div class="text-subtitle1 q-mt-sm">{{ selectedCategory.name }}</div>
        </div>
        <div class="text-right">
          <div class="text-h6">666 <q-icon name="expand_more" /></div>
          <div class="text-subtitle1 q-mt-sm">333 * 2 =</div>
        </div>
      </div>
    </div>
    <div class="q-pa-sm q-mx-auto" style="max-width: 400px">
      <q-form @submit.prevent="" class="q-gutter-md">
        <q-input bottom-slots v-model="name" label="Tên danh mục" counter lazy-rules :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng nhập tên danh mục',
        ]">
          <template v-slot:prepend>
            <q-icon name="rate_review" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="name = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-form>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="toggleCalculator = !toggleCalculator" fab icon="calculate" color="primary" />
    </q-page-sticky>
    <q-dialog v-model="openDialog" @click="handleDialog" position="bottom">
      <list-category-2 :listCategory="listCategory" @getCategory="handleGetCategory"></list-category-2>
    </q-dialog>

    <calculator v-if="toggleCalculator"></calculator>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useAuthUser from "src/composables/useAuthUser";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";
import { useRouter } from "vue-router";
import useApi from "src/composables/useApi";
import ListCategory2 from "src/components/ListCategory2.vue";
import Calculator from "src/components/Calculator.vue";

const { fetchListData} = useApi();
const { user } = useAuthUser()
const categoryStore = useCategoryStore()
const openDialog = ref(true)
const selectedCategory = ref({})
const name = ref("");
const listCategory = ref([])
const table = "Categories"
const toggleCalculator = ref(false)

const handleDialog = () => {
  openDialog.value = !openDialog.value;
};

watch(() => openDialog.value,
  () => {
    if (Object.keys(selectedCategory.value).length === 0) {
      selectedCategory.value = listCategory.value[0]
    }
  }
)

const handleGetCategory = (item) => {
  selectedCategory.value = item
  openDialog.value = false
}

const handleListCategory = async () => {
  try {
    listCategory.value = await fetchListData(table, user.value.id);
  } catch (error) {
    notifyError(error.message);
  } finally {
  }
};

onMounted(() => {
  handleListCategory();
})

</script>
