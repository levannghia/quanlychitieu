<template>
  <q-page>
    <div class="bg-primary" id="custom-money-note">
      <div
        class="text-white box-shadow q-pa-md row justify-between items-center"
      >
        <div class="text-left">
          <q-btn
            :icon="categoryStore.selectedCategory.type ? 'monetization_on' : 'credit_card_off'"
            round
            :color="categoryStore.selectedCategory.type ? 'positive' : 'warning'"
            @click="handleDialog"
          ></q-btn>
          <div class="text-subtitle1 q-mt-sm">{{categoryStore.selectedCategory.name}}</div>
        </div>
        <div class="text-right">
          <div class="text-h6">666 <q-icon name="expand_more" /></div>
          <div class="text-subtitle1 q-mt-sm">333 * 2 =</div>
        </div>
      </div>
    </div>
    <div class="q-pa-sm q-mx-auto" style="max-width: 400px">
      <q-form @submit.prevent="" class="q-gutter-md">
        <q-input
          bottom-slots
          v-model="name"
          label="Tên danh mục"
          counter
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Vui lòng nhập tên danh mục',
          ]"
        >
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
      <q-btn :to="{ name: 'note.create' }" fab icon="add" color="primary" />
    </q-page-sticky>
    <q-dialog v-model="openDialog" @click="handleDialog" position="bottom">
      <list-category></list-category>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useAuthUser from "src/composables/useAuthUser";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";
import { useRouter } from "vue-router";
import ListCategory from "src/components/ListCategory.vue";

const filterDate = ref({});
const openDialog = ref(true);
const name = ref("");
const categoryStore = useCategoryStore()

const handleDialog = () => {
  openDialog.value = !openDialog.value;
};

onBeforeUnmount(() => {
  categoryStore.selectedCategory.name = ''
  categoryStore.selectedCategory.type = null
})
</script>
