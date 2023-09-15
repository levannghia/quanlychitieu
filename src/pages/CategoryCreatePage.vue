<template>
  <q-page padding>
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-form @submit.prevent="handleCreateCategory" class="q-gutter-md">
        <q-input bottom-slots v-model="name" label="Tên danh mục" counter lazy-rules :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng nhập tên danh mục',
        ]">
          <template v-slot:prepend>
            <q-icon name="rate_review" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="name = ''" class="cursor-pointer" />
          </template>

          <template v-slot:hint> Field hint </template>
        </q-input>
        <q-select color="primary" filled v-model="typeCategory" :options="options" label="Loại danh mục">
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>
        <div>
          <q-btn label="SAVE" type="submit" color="primary" :disable="loading" class="full-width" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useCategoryStore } from "src/stores/category-store"
import useAuthUser from "src/composables/useAuthUser"
import useSupabase from "src/boot/supabase"
import useNotify from "src/composables/useNotify"
import { useRouter } from 'vue-router'

const categoryStore = useCategoryStore()
const loading = ref(false)
const { user } = useAuthUser()
const { supabase } = useSupabase()
const { notifyError, notifySuccess } = useNotify()
const router = useRouter()

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

const handleCreateCategory = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('categories')
      .insert({userId: user.value.id , name: name.value, type: typeCategory.value.value })
      .select();
      if (error) throw error
      notifySuccess("Thêm thành công!")

      setTimeout(() => {
        loading.value = false
        router.push({name: 'category.index'})
      }, 1000)
  } catch (error) {
    notifyError(error.message);
  }
}

watch(
  () => typeCategory.value.value,
  () => {
    if (typeCategory.value.value) {
      categoryStore.type = true;
    }else{
      categoryStore.type = false;
    }
  }
);

onUnmounted(() => {
  categoryStore.bcrumb = ''
})
</script>
