<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >

    <div>
      Hello {{ user.email }}
    </div>
  </q-page>
</template>

<script setup>
import useAuthUser from 'src/composables/useAuthUser';

const { user } = useAuthUser()
</script>
