<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-form @submit.prevent="" class="q-gutter-md">
        <q-input
          bottom-slots
          v-model="name"
          label="Tên danh mục"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="rate_review" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="name = ''" class="cursor-pointer" />
          </template>

          <template v-slot:hint> Field hint </template>
        </q-input>

        <div>
          <q-btn
            label="Đăng nhập"
            type="submit"
            color="primary"
            class="full-width"
          />
        </div>
        {{ categoryStore.type }}
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useCategoryStore } from 'src/stores/category-store';
const categoryStore = useCategoryStore()

const name = ref(null);
</script>