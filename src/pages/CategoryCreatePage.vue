<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">
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

          <template v-slot:hint> Field hint </template>
        </q-input>
        <q-select
          color="primary"
          filled
          v-model="typeCategory"
          :options="options"
          label="Loại danh mục"
        >
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>
        <div>
          <q-btn
            label="SAVE"
            type="submit"
            color="primary"
            class="full-width"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useCategoryStore } from "src/stores/category-store"
import useAuthUser from "src/composables/useAuthUser"

const categoryStore = useCategoryStore()
const { user } = useAuthUser()

console.log(user.value);
const name = ref(null);
let lable = categoryStore.type === true ? "Khoảng thu" : "Khoảng chi";
const typeCategory = ref({
  label: lable,
  value: categoryStore.type,
});


onMounted(() => {
  categoryStore.bcrumb = 'Thêm danh mục'
})

let options = [
  {
    label: "Khoảng thu",
    value: true,
  },
  {
    label: "khoảng chi",
    value: false,
  },
];

// onBeforeMount(() => {
//   prisma.disconnect();
// })

onUnmounted(() => {
  categoryStore.bcrumb = ''
})
</script>