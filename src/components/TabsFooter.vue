<template>
  <q-tabs v-model="tabFooter" class="text-primary">
    <q-route-tab
      :to="{ name: 'category.index' }"
      name="category"
      icon="category"
    />
    <q-route-tab :to="{ name: 'category.chart' }" name="chart" icon="incomplete_circle" />
    <q-route-tab :to="{ name: 'home' }" name="home" icon="home" />
    <q-route-tab name="movies" icon="movie" />
  </q-tabs>
</template>

<script setup>
import { ref } from 'vue'
const tabFooter = ref('home');
</script>
