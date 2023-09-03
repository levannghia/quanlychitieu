<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar class="text-primary">
        <q-btn @click="$router.go(-1)" flat dense round icon="keyboard_backspace" aria-label="Menu" />

        <q-toolbar-title> {{ categoryStore.bcrumb == '' ? 'Phân loại danh mục' : categoryStore.bcrumb }}  </q-toolbar-title>

        <div>
          <q-btn :to="{name: 'category.create'}" flat round color="primary" icon="add">
            <q-tooltip> Thêm danh mục </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-white">
      <tabs-footer></tabs-footer>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import TabsFooter from 'components/TabsFooter.vue'
import useAuthUser from "src/composables/useAuthUser";
import { useRouter } from "vue-router";
import { useCategoryStore } from "src/stores/category-store";

const categoryStore = useCategoryStore();
const router = useRouter();


</script>
