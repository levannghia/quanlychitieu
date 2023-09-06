<template>
    <q-card style="width: 100%">
      <q-linear-progress :value="0.6" color="pink" />

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">The Walker</div>
          <div class="text-grey">Fitz & The Tantrums</div>
        </div>

        <q-space />

        <q-btn flat round icon="fast_rewind" />
        <q-btn flat round icon="pause" />
        <q-btn flat round icon="fast_forward" />
      </q-card-section>
    </q-card>
</template>

<script setup>
import { ref, toRefs } from 'vue';

// const emit = defineEmits(['toggleDialog'])
// const openDialog = ref(true)

// const handleDialog = () => {
//   emit('toggleDialog', dialog.value)
//   openDialog.value = !openDialog.value
// }
</script>
